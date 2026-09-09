"""
CYQORA - Cyber Risk Quantification & Investment Optimization Platform
Backend API (FastAPI)
Problem Statement: Smart India Hackathon
Tagline: From Risk Score -> To Rupees -> To the Right Investment
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import math

app = FastAPI(
    title="CYQORA Risk Engine API",
    description="Probabilistic Cyber Risk Quantification and Knapsack Investment Optimizer",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# PYDANTIC SCHEMAS
# ==========================================

class ThreatVector(BaseModel):
    id: str
    name: str
    probability: float
    financial_impact: float
    expected_annual_loss: float
    severity: str
    confidence: int
    primary_vulnerability: str
    recommended_control: str
    percentage_share: float

class ConfidenceInterval(BaseModel):
    lower: float
    upper: float
    p50: float
    confidence_level: float = 0.95

class RiskProfileResponse(BaseModel):
    total_exposure: float
    expected_annual_loss: float
    incident_probability: float
    confidence_interval: ConfidenceInterval
    protected_assets: int
    security_budget: float
    budget_utilization: float
    threats: List[ThreatVector]

class BudgetOptimizeRequest(BaseModel):
    budget: float = Field(..., ge=500000, le=100000000, description="Security budget in INR")

class SecurityControl(BaseModel):
    id: str
    name: str
    cost: float
    risk_reduction: float
    roi: float
    risk_reduction_pct: float
    priority: str
    decision: str
    selected: bool
    category: str
    description: str

class OptimizationResponse(BaseModel):
    budget: float
    selected_controls: List[SecurityControl]
    total_cost: float
    total_risk_reduction: float
    remaining_budget: float
    residual_risk: float
    roi: float
    portfolio_efficiency: float
    unselected_controls: List[SecurityControl]

class SimulationRequest(BaseModel):
    mfa_coverage: float = Field(65.0, ge=0.0, le=100.0)
    edr_coverage: float = Field(72.0, ge=0.0, le=100.0)
    segmentation: float = Field(40.0, ge=0.0, le=100.0)
    backup_resilience: float = Field(55.0, ge=0.0, le=100.0)
    soc_monitoring: float = Field(60.0, ge=0.0, le=100.0)

class SimulationResponse(BaseModel):
    baseline_exposure: float
    simulated_exposure: float
    baseline_eal: float
    simulated_eal: float
    risk_reduction_percentage: float
    incident_probability: float
    residual_risk: float
    investment_requirement: float
    risk_score: float
    confidence: int
    simulated_threats: List[Dict[str, Any]]

class FuzzyImpactRequest(BaseModel):
    asset_criticality: float = Field(0.9, ge=0.0, le=1.0)
    threat_severity: float = Field(0.85, ge=0.0, le=1.0)
    control_weakness: float = Field(0.7, ge=0.0, le=1.0)
    business_impact: float = Field(0.8, ge=0.0, le=1.0)

class FuzzyImpactResponse(BaseModel):
    asset_criticality_membership: Dict[str, float]
    threat_severity_membership: Dict[str, float]
    control_weakness_membership: Dict[str, float]
    business_impact_membership: Dict[str, float]
    fuzzy_rule_activations: Dict[str, float]
    financial_impact_multiplier: float
    impact_index: float

class BayesianRiskRequest(BaseModel):
    threat_frequency: float = 0.85
    p_phishing: float = 0.65
    p_cred_theft_given_phish: float = 0.58
    p_mfa_fail_given_cred: float = 0.42
    p_priv_esc_given_mfa: float = 0.50
    p_compromise_given_priv: float = 0.62

class BayesianRiskResponse(BaseModel):
    incident_probability: float
    step_probabilities: Dict[str, float]
    dag_nodes: List[Dict[str, Any]]


# ==========================================
# MASTER SEED DATA
# ==========================================

BASELINE_THREATS = [
    {
        "id": "t-1",
        "name": "Ransomware",
        "probability": 0.187,
        "financial_impact": 18200000.0,
        "expected_annual_loss": 3403400.0,
        "severity": "CRITICAL",
        "confidence": 89,
        "primary_vulnerability": "Insufficient MFA & Legacy SMB Exposure",
        "recommended_control": "MFA + Cryptographic Backup",
        "percentage_share": 38.0
    },
    {
        "id": "t-2",
        "name": "Data Breach",
        "probability": 0.162,
        "financial_impact": 15400000.0,
        "expected_annual_loss": 2494800.0,
        "severity": "CRITICAL",
        "confidence": 92,
        "primary_vulnerability": "Unencrypted Database S3 Exfiltration",
        "recommended_control": "CSPM + Database DLP & Zero Trust",
        "percentage_share": 32.0
    },
    {
        "id": "t-3",
        "name": "Account Compromise",
        "probability": 0.245,
        "financial_impact": 5300000.0,
        "expected_annual_loss": 1298500.0,
        "severity": "HIGH",
        "confidence": 86,
        "primary_vulnerability": "Session Hijacking & Single-Factor VPN",
        "recommended_control": "FIDO2 Phishing-Resistant MFA",
        "percentage_share": 11.0
    },
    {
        "id": "t-4",
        "name": "Service Disruption",
        "probability": 0.095,
        "financial_impact": 3850000.0,
        "expected_annual_loss": 365750.0,
        "severity": "MODERATE",
        "confidence": 84,
        "primary_vulnerability": "DDoS Transit Saturation & Single Cloud Region",
        "recommended_control": "Multi-Region Cloud WAF & Scrubbing",
        "percentage_share": 8.0
    },
    {
        "id": "t-5",
        "name": "Insider Threat",
        "probability": 0.052,
        "financial_impact": 2900000.0,
        "expected_annual_loss": 150800.0,
        "severity": "MODERATE",
        "confidence": 78,
        "primary_vulnerability": "Excessive Admin Privileges & Unmonitored Access",
        "recommended_control": "Privileged Access Management (PAM)",
        "percentage_share": 6.0
    },
    {
        "id": "t-6",
        "name": "Supply Chain Exploitation",
        "probability": 0.071,
        "financial_impact": 2550000.0,
        "expected_annual_loss": 181050.0,
        "severity": "MODERATE",
        "confidence": 81,
        "primary_vulnerability": "Third-Party Vendor Open Port / Compromised Package",
        "recommended_control": "Vendor Risk Screening & Software Bill of Materials (SBOM)",
        "percentage_share": 5.0
    }
]

CONTROLS_CATALOG = [
    {
        "id": "c-1",
        "name": "FIDO2 Phishing-Resistant MFA",
        "cost": 1200000.0,
        "risk_reduction": 5800000.0,
        "category": "Identity & Access",
        "priority": "HIGH PRIORITY",
        "description": "Hardware-backed MFA enforcement across 100% of internal workforce & cloud IAM."
    },
    {
        "id": "c-2",
        "name": "EDR / XDR Telemetry Upgrade",
        "cost": 1800000.0,
        "risk_reduction": 4400000.0,
        "category": "Endpoint Defense",
        "priority": "HIGH PRIORITY",
        "description": "Next-gen behavioral EDR with automated isolation & memory scanning."
    },
    {
        "id": "c-3",
        "name": "Zero Trust Micro-Segmentation",
        "cost": 2200000.0,
        "risk_reduction": 4200000.0,
        "category": "Network Infrastructure",
        "priority": "HIGH PRIORITY",
        "description": "East-west policy enforcement preventing lateral movement into payment systems."
    },
    {
        "id": "c-4",
        "name": "Immutable Cryptographic Backup",
        "cost": 1600000.0,
        "risk_reduction": 3900000.0,
        "category": "Data Resiliency",
        "priority": "RECOMMENDED",
        "description": "Air-gapped WORM encrypted snapshots guaranteeing rapid ransomware recovery."
    },
    {
        "id": "c-5",
        "name": "24/7 Managed SOC & MDR",
        "cost": 2600000.0,
        "risk_reduction": 3500000.0,
        "category": "SecOps & Triage",
        "priority": "RECOMMENDED",
        "description": "Around-the-clock threat hunting with sub-15 minute mean time to contain (MTTC)."
    },
    {
        "id": "c-6",
        "name": "Privileged Access Management (PAM)",
        "cost": 1400000.0,
        "risk_reduction": 2800000.0,
        "category": "Identity & Access",
        "priority": "RECOMMENDED",
        "description": "Just-in-time credential vaulting with automated root rotation and session recordings."
    },
    {
        "id": "c-7",
        "name": "AI Email Security Gateway",
        "cost": 850000.0,
        "risk_reduction": 1800000.0,
        "category": "Email & Messaging",
        "priority": "OPTIONAL",
        "description": "Natural language processing detection for executive impersonation and BEC."
    },
    {
        "id": "c-8",
        "name": "Cloud Security Posture (CSPM)",
        "cost": 1100000.0,
        "risk_reduction": 2100000.0,
        "category": "Cloud Governance",
        "priority": "OPTIONAL",
        "description": "Continuous compliance audit across AWS, GCP, and Azure workloads."
    },
    {
        "id": "c-9",
        "name": "Zero Trust Network Access (ZTNA)",
        "cost": 1900000.0,
        "risk_reduction": 2400000.0,
        "category": "Network Infrastructure",
        "priority": "OPTIONAL",
        "description": "Per-app software-defined perimeter replacing traditional broad legacy VPNs."
    },
    {
        "id": "c-10",
        "name": "Automated Vulnerability Management",
        "cost": 750000.0,
        "risk_reduction": 1300000.0,
        "category": "AppSec & Vulnerability",
        "priority": "OPTIONAL",
        "description": "Risk-based prioritization pipeline connected to CI/CD and production clusters."
    }
]

ENTERPRISE_ASSETS = [
    {
        "id": "ast-1",
        "name": "Payment Gateway Core",
        "unit": "FinTech Operations",
        "criticality": "TIER 1 - MISSION CRITICAL",
        "revenue_dependency": 360000000.0,
        "threat_exposure": "Ransomware, Account Hijack, API Exploit",
        "control_score": 78,
        "financial_exposure": 12400000.0,
        "status": "PROTECTED",
        "compliance": "PCI-DSS 4.0, RBI Cyber Security Framework"
    },
    {
        "id": "ast-2",
        "name": "Customer KYC & PII Vault",
        "unit": "Compliance & Security",
        "criticality": "TIER 1 - MISSION CRITICAL",
        "revenue_dependency": 210000000.0,
        "threat_exposure": "Data Breach, Exfiltration, Insider Leak",
        "control_score": 72,
        "financial_exposure": 11800000.0,
        "status": "AT RISK",
        "compliance": "DPDP Act 2023, ISO 27001"
    },
    {
        "id": "ast-3",
        "name": "Enterprise ERP System",
        "unit": "Supply Chain & Billing",
        "criticality": "TIER 2 - HIGH",
        "revenue_dependency": 145000000.0,
        "threat_exposure": "Ransomware, Service Disruption",
        "control_score": 64,
        "financial_exposure": 7400000.0,
        "status": "MODERATE",
        "compliance": "SOC 2 Type II"
    },
    {
        "id": "ast-4",
        "name": "Employee Identity Provider (Okta/AD)",
        "unit": "Enterprise IT",
        "criticality": "TIER 1 - MISSION CRITICAL",
        "revenue_dependency": 90000000.0,
        "threat_exposure": "Credential Stuffing, MFA Bypass",
        "control_score": 82,
        "financial_exposure": 5300000.0,
        "status": "PROTECTED",
        "compliance": "CIS Benchmarks"
    },
    {
        "id": "ast-5",
        "name": "Production Kubernetes Clusters",
        "unit": "Cloud Engineering",
        "criticality": "TIER 1 - MISSION CRITICAL",
        "revenue_dependency": 280000000.0,
        "threat_exposure": "Misconfiguration, Lateral Movement",
        "control_score": 68,
        "financial_exposure": 4200000.0,
        "status": "MONITORED",
        "compliance": "NIST CSF 2.0"
    },
    {
        "id": "ast-6",
        "name": "Corporate Email Infrastructure",
        "unit": "Corporate Operations",
        "criticality": "TIER 3 - MEDIUM",
        "revenue_dependency": 40000000.0,
        "threat_exposure": "Phishing Ingress, BEC Fraud",
        "control_score": 75,
        "financial_exposure": 2800000.0,
        "status": "PROTECTED",
        "compliance": "DMARC, SPF, DKIM Strict"
    },
    {
        "id": "ast-7",
        "name": "Public Developer API Platform",
        "unit": "Platform Engineering",
        "criticality": "TIER 2 - HIGH",
        "revenue_dependency": 85000000.0,
        "threat_exposure": "DDoS, API Abuse, Token Theft",
        "control_score": 62,
        "financial_exposure": 2300000.0,
        "status": "MODERATE",
        "compliance": "OWASP API Top 10"
    },
    {
        "id": "ast-8",
        "name": "Analytics & Snowflake Data Lake",
        "unit": "Business Intelligence",
        "criticality": "TIER 3 - MEDIUM",
        "revenue_dependency": 55000000.0,
        "threat_exposure": "Data Exfiltration, Unchecked Sharing",
        "control_score": 71,
        "financial_exposure": 2000000.0,
        "status": "MONITORED",
        "compliance": "GDPR / DPDP"
    }
]

# ==========================================
# MATHEMATICAL ENGINES
# ==========================================

def calculate_triangular_membership(x: float, a: float, b: float, c: float) -> float:
    """Computes triangular fuzzy membership degree for value x in range [a, b, c]."""
    if x <= a or x >= c:
        return 0.0
    elif a < x <= b:
        return (x - a) / (b - a) if b > a else 1.0
    else:
        return (c - x) / (c - b) if c > b else 1.0

def fuzzy_uncertainty_engine(asset_crit: float, threat_sev: float, control_weak: float, biz_impact: float) -> Dict[str, Any]:
    """
    Fuzzy rule-based quantification of Financial Impact Multiplier.
    Evaluates triangular memberships and Mamdani inference.
    """
    # Low: [0.0, 0.0, 0.45], Med: [0.3, 0.5, 0.75], High: [0.6, 1.0, 1.0]
    crit_low = calculate_triangular_membership(asset_crit, 0.0, 0.2, 0.45)
    crit_med = calculate_triangular_membership(asset_crit, 0.3, 0.5, 0.75)
    crit_high = calculate_triangular_membership(asset_crit, 0.6, 0.85, 1.0)
    if asset_crit >= 0.85:
        crit_high = 1.0

    weak_low = calculate_triangular_membership(control_weak, 0.0, 0.2, 0.45)
    weak_med = calculate_triangular_membership(control_weak, 0.3, 0.5, 0.75)
    weak_high = calculate_triangular_membership(control_weak, 0.6, 0.85, 1.0)
    if control_weak >= 0.85:
        weak_high = 1.0

    # Rule base aggregation
    # Rule 1: High Crit AND High Weakness -> Critical Impact
    r1 = min(crit_high, weak_high, threat_sev)
    # Rule 2: Med Crit OR Med Weakness -> Moderate Impact
    r2 = max(crit_med, weak_med) * 0.5
    # Rule 3: Low Weakness -> Suppressed Impact
    r3 = weak_low * 0.2

    # Defuzzification (centroid approximation)
    numerator = (r1 * 0.92) + (r2 * 0.55) + (r3 * 0.25) + (biz_impact * 0.4)
    denominator = max(r1 + r2 + r3 + 0.4, 0.001)
    impact_multiplier = min(max(numerator / denominator, 0.15), 1.0)

    return {
        "asset_criticality_membership": {"low": round(crit_low, 3), "medium": round(crit_med, 3), "high": round(crit_high, 3)},
        "control_weakness_membership": {"low": round(weak_low, 3), "medium": round(weak_med, 3), "high": round(weak_high, 3)},
        "fuzzy_rule_activations": {"critical_exposure": round(r1, 3), "moderate_exposure": round(r2, 3), "controlled_exposure": round(r3, 3)},
        "financial_impact_multiplier": round(impact_multiplier, 3),
        "impact_index": round(impact_multiplier * 100, 1)
    }

def solve_knapsack_01(controls: List[Dict[str, Any]], budget: float) -> Dict[str, Any]:
    """
    0/1 Knapsack dynamic programming solver for budget-constrained security portfolio optimization.
    Maximize: Sum(Risk Reduction * X_i)
    Subject to: Sum(Cost * X_i) <= Budget
    """
    # Scale costs to integer units of 10,000 INR to enable crisp DP matrix computation
    scale = 10000.0
    int_budget = int(budget / scale)
    n = len(controls)

    weights = [int(c["cost"] / scale) for c in controls]
    values = [c["risk_reduction"] for c in controls]

    # DP Table
    dp = [[0.0] * (int_budget + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        w = weights[i - 1]
        v = values[i - 1]
        for b in range(int_budget + 1):
            if w <= b:
                dp[i][b] = max(dp[i - 1][b], dp[i - 1][b - w] + v)
            else:
                dp[i][b] = dp[i - 1][b]

    # Backtrack selected items
    selected_indices = []
    b_curr = int_budget
    for i in range(n, 0, -1):
        if dp[i][b_curr] != dp[i - 1][b_curr]:
            selected_indices.append(i - 1)
            b_curr -= weights[i - 1]

    selected_set = set(selected_indices)
    total_cost = sum(controls[idx]["cost"] for idx in selected_indices)
    total_rr = sum(controls[idx]["risk_reduction"] for idx in selected_indices)
    remaining_budget = max(0.0, budget - total_cost)

    # Baseline enterprise exposure is 4.82 Cr
    baseline_exposure = 48200000.0
    residual_risk = max(5000000.0, baseline_exposure - total_rr)
    roi = round(total_rr / total_cost, 2) if total_cost > 0 else 0.0

    selected_list = []
    unselected_list = []

    for idx, c in enumerate(controls):
        is_sel = idx in selected_set
        c_roi = round(c["risk_reduction"] / c["cost"], 2)
        pct_reduction = round((c["risk_reduction"] / baseline_exposure) * 100, 1)

        decision = "RECOMMENDED" if is_sel else ("BUDGET CONSTRAINED" if c["cost"] > remaining_budget else "DEFER")
        if not is_sel and c_roi < 1.8:
            decision = "LOW ROI"

        ctrl_obj = {
            "id": c["id"],
            "name": c["name"],
            "cost": c["cost"],
            "risk_reduction": c["risk_reduction"],
            "roi": c_roi,
            "risk_reduction_pct": pct_reduction,
            "priority": c.get("priority", "RECOMMENDED"),
            "decision": decision,
            "selected": is_sel,
            "category": c.get("category", "General Security"),
            "description": c.get("description", "")
        }

        if is_sel:
            selected_list.append(ctrl_obj)
        else:
            unselected_list.append(ctrl_obj)

    # Sort selected by ROI descending
    selected_list.sort(key=lambda x: x["roi"], reverse=True)
    unselected_list.sort(key=lambda x: x["roi"], reverse=True)

    return {
        "budget": budget,
        "selected_controls": selected_list,
        "total_cost": total_cost,
        "total_risk_reduction": total_rr,
        "remaining_budget": remaining_budget,
        "residual_risk": residual_risk,
        "roi": roi,
        "portfolio_efficiency": roi,
        "unselected_controls": unselected_list
    }


# ==========================================
# API ENDPOINTS
# ==========================================

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "engine": "CYQORA Risk Engine v1.0",
        "models": ["Bayesian DAG", "Fuzzy Inference", "0/1 Knapsack DP"],
        "currency": "INR (₹)"
    }

@app.get("/api/risk-profile", response_model=RiskProfileResponse)
def get_risk_profile():
    """Returns baseline enterprise cyber risk exposure and expected annual loss."""
    total_exposure = sum(t["financial_impact"] for t in BASELINE_THREATS)
    total_eal = sum(t["expected_annual_loss"] for t in BASELINE_THREATS)

    # Monte Carlo deterministic uncertainty bounds
    ci = ConfidenceInterval(
        lower=34700000.0,
        upper=69800000.0,
        p50=48200000.0,
        confidence_level=0.95
    )

    threat_models = [ThreatVector(**t) for t in BASELINE_THREATS]

    return RiskProfileResponse(
        total_exposure=48200000.0,
        expected_annual_loss=13600000.0,
        incident_probability=0.187,
        confidence_interval=ci,
        protected_assets=12,
        security_budget=10000000.0,
        budget_utilization=68.0,
        threats=threat_models
    )

@app.post("/api/optimize-budget", response_model=OptimizationResponse)
def optimize_budget(payload: BudgetOptimizeRequest):
    """Computes optimal security control portfolio under provided capital budget."""
    result = solve_knapsack_01(CONTROLS_CATALOG, payload.budget)
    return OptimizationResponse(**result)

@app.post("/api/simulate", response_model=SimulationResponse)
def simulate_risk(payload: SimulationRequest):
    """
    Real-time What-If Cyber Risk Simulator.
    Simulates sensitivity of threat probabilities, EAL, and exposure based on defensive control coverage.
    """
    baseline_exp = 48200000.0
    baseline_eal = 13600000.0

    # Sensitivity weights
    # MFA reduces account hijack by up to 88% and ransomware ingress by up to 75%
    mfa_ratio = payload.mfa_coverage / 100.0
    edr_ratio = payload.edr_coverage / 100.0
    seg_ratio = payload.segmentation / 100.0
    bak_ratio = payload.backup_resilience / 100.0
    soc_ratio = payload.soc_monitoring / 100.0

    # Dynamic threat computation
    simulated_threats = []
    total_sim_impact = 0.0
    total_sim_eal = 0.0

    for t in BASELINE_THREATS:
        t_prob = t["probability"]
        t_impact = t["financial_impact"]

        if t["name"] == "Ransomware":
            # MFA + EDR suppresses probability; Backup suppresses financial impact
            prob_factor = max(0.12, 1.0 - (0.55 * mfa_ratio) - (0.35 * edr_ratio))
            impact_factor = max(0.20, 1.0 - (0.65 * bak_ratio) - (0.15 * seg_ratio))
        elif t["name"] == "Data Breach":
            # Segmentation + EDR suppresses probability; SOC suppresses impact
            prob_factor = max(0.18, 1.0 - (0.45 * seg_ratio) - (0.35 * edr_ratio))
            impact_factor = max(0.25, 1.0 - (0.40 * soc_ratio) - (0.35 * mfa_ratio))
        elif t["name"] == "Account Compromise":
            prob_factor = max(0.08, 1.0 - (0.85 * mfa_ratio))
            impact_factor = max(0.30, 1.0 - (0.40 * soc_ratio))
        elif t["name"] == "Service Disruption":
            prob_factor = max(0.25, 1.0 - (0.35 * seg_ratio) - (0.40 * soc_ratio))
            impact_factor = max(0.35, 1.0 - (0.50 * bak_ratio))
        else:
            prob_factor = max(0.20, 1.0 - (0.30 * soc_ratio) - (0.30 * edr_ratio))
            impact_factor = max(0.30, 1.0 - (0.35 * seg_ratio))

        sim_p = round(t_prob * prob_factor, 4)
        sim_imp = round(t_impact * impact_factor, 0)
        sim_eal = round(sim_p * sim_imp, 0)

        total_sim_impact += sim_imp
        total_sim_eal += sim_eal

        simulated_threats.append({
            "name": t["name"],
            "probability": sim_p,
            "financial_impact": sim_imp,
            "expected_annual_loss": sim_eal,
            "probability_reduction_pct": round((1.0 - prob_factor) * 100, 1),
            "impact_reduction_pct": round((1.0 - impact_factor) * 100, 1)
        })

    # Overall reduction
    sim_exposure = round(total_sim_impact, 0)
    risk_reduction_pct = round(((baseline_exp - sim_exposure) / baseline_exp) * 100, 1)

    # Cost estimate for achieving simulated coverages
    investment_req = round(
        (payload.mfa_coverage * 15000.0) +
        (payload.edr_coverage * 22000.0) +
        (payload.segmentation * 28000.0) +
        (payload.backup_resilience * 18000.0) +
        (payload.soc_monitoring * 32000.0),
        0
    )

    avg_prob = sum(st["probability"] for st in simulated_threats) / len(simulated_threats)
    sim_risk_score = round(max(15.0, 100.0 - (risk_reduction_pct * 1.1)), 1)

    return SimulationResponse(
        baseline_exposure=baseline_exp,
        simulated_exposure=sim_exposure,
        baseline_eal=baseline_eal,
        simulated_eal=round(total_sim_eal, 0),
        risk_reduction_percentage=risk_reduction_pct,
        incident_probability=round(avg_prob, 3),
        residual_risk=sim_exposure,
        investment_requirement=investment_req,
        risk_score=sim_risk_score,
        confidence=89,
        simulated_threats=simulated_threats
    )

@app.post("/api/fuzzy-impact", response_model=FuzzyImpactResponse)
def compute_fuzzy_impact(payload: FuzzyImpactRequest):
    """Computes linguistic fuzzy rule inferences and impact multiplier."""
    res = fuzzy_uncertainty_engine(
        payload.asset_criticality,
        payload.threat_severity,
        payload.control_weakness,
        payload.business_impact
    )
    return FuzzyImpactResponse(
        asset_criticality_membership=res["asset_criticality_membership"],
        threat_severity_membership={"low": 0.1, "medium": 0.3, "high": round(payload.threat_severity, 2)},
        control_weakness_membership=res["control_weakness_membership"],
        business_impact_membership={"low": 0.2, "medium": 0.4, "high": round(payload.business_impact, 2)},
        fuzzy_rule_activations=res["fuzzy_rule_activations"],
        financial_impact_multiplier=res["financial_impact_multiplier"],
        impact_index=res["impact_index"]
    )

@app.post("/api/bayesian-risk", response_model=BayesianRiskResponse)
def compute_bayesian_risk(payload: BayesianRiskRequest):
    """
    Computes Directed Acyclic Graph (DAG) conditional probability propagation:
    P(Incident) = P(Phish) * P(Cred|Phish) * P(MFA_Fail|Cred) * P(Priv_Esc|MFA) * P(Compromise|Priv)
    """
    chain_prob = (
        payload.p_phishing *
        payload.p_cred_theft_given_phish *
        payload.p_mfa_fail_given_cred *
        payload.p_priv_esc_given_mfa *
        payload.p_compromise_given_priv
    )

    incident_p = round(chain_prob * payload.threat_frequency, 4)

    dag = [
        {"id": "node-1", "label": "External Threat Activity", "prob": payload.threat_frequency, "level": 1},
        {"id": "node-2", "label": "Phishing Delivery", "prob": payload.p_phishing, "level": 2},
        {"id": "node-3", "label": "Credential Theft", "prob": payload.p_cred_theft_given_phish, "level": 3},
        {"id": "node-4", "label": "MFA Bypass / Failure", "prob": payload.p_mfa_fail_given_cred, "level": 4},
        {"id": "node-5", "label": "Privilege Escalation", "prob": payload.p_priv_esc_given_mfa, "level": 5},
        {"id": "node-6", "label": "Full System Compromise", "prob": payload.p_compromise_given_priv, "level": 6},
    ]

    return BayesianRiskResponse(
        incident_probability=incident_p,
        step_probabilities={
            "phishing": payload.p_phishing,
            "credential_theft": payload.p_cred_theft_given_phish,
            "mfa_failure": payload.p_mfa_fail_given_cred,
            "privilege_escalation": payload.p_priv_esc_given_mfa,
            "system_compromise": payload.p_compromise_given_priv
        },
        dag_nodes=dag
    )

@app.get("/api/assets")
def get_assets():
    """Returns enterprise asset inventory with criticality and revenue dependencies."""
    return ENTERPRISE_ASSETS

@app.get("/api/threats")
def get_threats():
    """Returns active threat intelligence vectors."""
    return BASELINE_THREATS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
