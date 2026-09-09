/**
 * CYQORA Frontend API Service Layer
 * Interfaces with FastAPI backend and includes deterministic mathematical fallback
 * for 100% reliable interactive demonstrations in all environments.
 */

import {
  RiskProfile,
  OptimizationResult,
  SimulationParams,
  SimulationResult,
  EnterpriseAsset,
  ThreatVector,
  SecurityControl
} from '../types';
import { BASELINE_THREATS_DATA, CONTROLS_CATALOG_DATA, ENTERPRISE_ASSETS_DATA } from '../data/demoData';

const API_BASE = '/api';

/**
 * Client-side 0/1 Knapsack Dynamic Programming solver
 * Matches exact Python backend math
 */
export function solveKnapsackLocal(controls: SecurityControl[], budget: number): OptimizationResult {
  // DP in ₹1 Lakh (100,000) integer units as specified in CYQORA model
  const scale = 100000;
  const intBudget = Math.floor(budget / scale);
  const n = controls.length;
  const weights = controls.map(c => Math.round(c.cost / scale));
  const values = controls.map(c => Math.round(c.risk_reduction / scale));

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(intBudget + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];
    for (let b = 0; b <= intBudget; b++) {
      if (w <= b) {
        dp[i][b] = Math.max(dp[i - 1][b], dp[i - 1][b - w] + v);
      } else {
        dp[i][b] = dp[i - 1][b];
      }
    }
  }

  const selectedIndices: number[] = [];
  let bCurr = intBudget;
  for (let i = n; i > 0; i--) {
    if (dp[i][bCurr] !== dp[i - 1][bCurr]) {
      selectedIndices.push(i - 1);
      bCurr -= weights[i - 1];
    }
  }

  const selectedSet = new Set(selectedIndices);
  const baselineEal = 13670000; // ₹1.37 Cr baseline EAL
  let totalCost = 0;
  let totalRiskReduction = 0;

  const selectedList: SecurityControl[] = [];
  const unselectedList: SecurityControl[] = [];

  controls.forEach((c, idx) => {
    const isSelected = selectedSet.has(idx);
    const roi = Number((c.risk_reduction / c.cost).toFixed(2));
    const pctReduction = Number(((c.risk_reduction / baselineEal) * 100).toFixed(1));

    if (isSelected) {
      totalCost += c.cost;
      totalRiskReduction += c.risk_reduction;
    }

    const remainingBudgetBefore = budget - totalCost;
    let decision = isSelected ? 'RECOMMENDED' : (c.cost > remainingBudgetBefore ? 'BUDGET CONSTRAINED' : 'DEFER');

    const item: SecurityControl = {
      ...c,
      selected: isSelected,
      roi,
      risk_reduction_pct: pctReduction,
      decision
    };

    if (isSelected) {
      selectedList.push(item);
    } else {
      unselectedList.push(item);
    }
  });

  const remainingBudget = Math.max(0, budget - totalCost);
  // 8% irreducible residual floor
  const irreducibleFloor = Math.round(baselineEal * 0.08);
  const residualRisk = Math.max(irreducibleFloor, baselineEal - totalRiskReduction);
  const overallRoi = totalCost > 0 ? Number((totalRiskReduction / totalCost).toFixed(2)) : 0;

  // Keep original order or sort
  selectedList.sort((a, b) => b.roi - a.roi);
  unselectedList.sort((a, b) => b.roi - a.roi);

  return {
    budget,
    selected_controls: selectedList,
    total_cost: totalCost,
    total_risk_reduction: totalRiskReduction,
    remaining_budget: remainingBudget,
    residual_risk: residualRisk,
    roi: overallRoi,
    portfolio_efficiency: overallRoi,
    unselected_controls: unselectedList
  };
}

/**
 * Local simulation sensitivity calculation
 */
export function simulateRiskLocal(params: SimulationParams): SimulationResult {
  const baselineExposure = 48200000;
  const baselineEal = 13600000;

  const mfaRatio = params.mfa_coverage / 100;
  const edrRatio = params.edr_coverage / 100;
  const segRatio = params.segmentation / 100;
  const bakRatio = params.backup_resilience / 100;
  const socRatio = params.soc_monitoring / 100;

  let totalSimImpact = 0;
  let totalSimEal = 0;

  const simulatedThreats = BASELINE_THREATS_DATA.map(t => {
    let probFactor = 1.0;
    let impactFactor = 1.0;

    if (t.name === 'Ransomware') {
      probFactor = Math.max(0.12, 1.0 - (0.55 * mfaRatio) - (0.35 * edrRatio));
      impactFactor = Math.max(0.20, 1.0 - (0.65 * bakRatio) - (0.15 * segRatio));
    } else if (t.name === 'Data Breach') {
      probFactor = Math.max(0.18, 1.0 - (0.45 * segRatio) - (0.35 * edrRatio));
      impactFactor = Math.max(0.25, 1.0 - (0.40 * socRatio) - (0.35 * mfaRatio));
    } else if (t.name === 'Account Compromise') {
      probFactor = Math.max(0.08, 1.0 - (0.85 * mfaRatio));
      impactFactor = Math.max(0.30, 1.0 - (0.40 * socRatio));
    } else if (t.name === 'Service Disruption') {
      probFactor = Math.max(0.25, 1.0 - (0.35 * segRatio) - (0.40 * socRatio));
      impactFactor = Math.max(0.35, 1.0 - (0.50 * bakRatio));
    } else {
      probFactor = Math.max(0.20, 1.0 - (0.30 * socRatio) - (0.30 * edrRatio));
      impactFactor = Math.max(0.30, 1.0 - (0.35 * segRatio));
    }

    const simProb = Number((t.probability * probFactor).toFixed(4));
    const simImpact = Math.round(t.financial_impact * impactFactor);
    const simEal = Math.round(simProb * simImpact);

    totalSimImpact += simImpact;
    totalSimEal += simEal;

    return {
      name: t.name,
      probability: simProb,
      financial_impact: simImpact,
      expected_annual_loss: simEal,
      probability_reduction_pct: Number(((1.0 - probFactor) * 100).toFixed(1)),
      impact_reduction_pct: Number(((1.0 - impactFactor) * 100).toFixed(1))
    };
  });

  const simExposure = totalSimImpact;
  const riskReductionPct = Number((((baselineExposure - simExposure) / baselineExposure) * 100).toFixed(1));

  const investmentReq = Math.round(
    (params.mfa_coverage * 15000) +
    (params.edr_coverage * 22000) +
    (params.segmentation * 28000) +
    (params.backup_resilience * 18000) +
    (params.soc_monitoring * 32000)
  );

  const avgProb = Number((simulatedThreats.reduce((acc, st) => acc + st.probability, 0) / simulatedThreats.length).toFixed(3));
  const simScore = Number(Math.max(15, 100 - (riskReductionPct * 1.1)).toFixed(1));

  return {
    baseline_exposure: baselineExposure,
    simulated_exposure: simExposure,
    baseline_eal: baselineEal,
    simulated_eal: totalSimEal,
    risk_reduction_percentage: riskReductionPct,
    incident_probability: avgProb,
    residual_risk: simExposure,
    investment_requirement: investmentReq,
    risk_score: simScore,
    confidence: 89,
    simulated_threats: simulatedThreats
  };
}

/**
 * Fetch baseline risk profile
 */
export async function fetchRiskProfile(): Promise<RiskProfile> {
  try {
    const res = await fetch(`${API_BASE}/risk-profile`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (err) {
    // Graceful fallback to deterministic local state
    return {
      total_exposure: 48200000,
      expected_annual_loss: 13600000,
      incident_probability: 0.187,
      confidence_interval: {
        lower: 34700000,
        upper: 69800000,
        p50: 48200000,
        confidence_level: 0.95
      },
      protected_assets: 12,
      security_budget: 10000000,
      budget_utilization: 68,
      threats: BASELINE_THREATS_DATA
    };
  }
}

/**
 * Request budget optimization
 */
export async function optimizeBudget(budget: number): Promise<OptimizationResult> {
  try {
    const res = await fetch(`${API_BASE}/optimize-budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return solveKnapsackLocal(CONTROLS_CATALOG_DATA, budget);
  }
}

/**
 * Request sensitivity simulation
 */
export async function simulateRisk(params: SimulationParams): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return simulateRiskLocal(params);
  }
}

/**
 * Fetch Enterprise Assets inventory
 */
export async function fetchAssets(): Promise<EnterpriseAsset[]> {
  try {
    const res = await fetch(`${API_BASE}/assets`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return ENTERPRISE_ASSETS_DATA;
  }
}

/**
 * Fetch Threat Vectors
 */
export async function fetchThreats(): Promise<ThreatVector[]> {
  try {
    const res = await fetch(`${API_BASE}/threats`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return BASELINE_THREATS_DATA;
  }
}
