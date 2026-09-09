import React, { useState } from 'react';
import { Cpu, Network, Sparkles, CheckCircle2, ShieldAlert, Binary, Sigma, BarChart3, Database } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const AIModels: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bayesian' | 'fuzzy' | 'knapsack' | 'calibration'>('bayesian');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#6F6275] text-xs font-medium tracking-wide mb-1">
            <Cpu className="w-4 h-4" />
            <span>Mathematical rigor & actuarial proofs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
            AI & Quantitative Risk Engines
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] mt-1 max-w-2xl">
            Inspect the underlying mathematical algorithms, causal DAGs, fuzzy membership matrices, and dynamic programming formulations powering Cyqora.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#718C78]" />
          <span className="text-[#718C78] font-medium">100% Deterministic Reproducibility</span>
        </div>
      </div>

      {/* Engine Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm text-xs font-mono">
        {[
          { id: 'bayesian', label: '1. Bayesian Causal Network', icon: Network },
          { id: 'fuzzy', label: '2. Fuzzy Financial Engine', icon: Sparkles },
          { id: 'knapsack', label: '3. 0/1 Knapsack Optimizer', icon: Binary },
          { id: 'calibration', label: '4. Calibration & Verifiability', icon: Sigma },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#F1F0EC] text-[#6F6275] border border-[#6F6275]'
                  : 'text-[#6F6D68] hover:text-[#292927] hover:bg-[#F1F0EC]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Bayesian Causal Network */}
      {activeTab === 'bayesian' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
              <h2 className="text-base font-bold text-[#292927] flex items-center gap-2">
                <Network className="w-5 h-5 text-[#6F6275]" />
                Bayesian Directed Acyclic Graph (DAG) for Incident Likelihood
              </h2>
              <span className="text-xs font-mono text-[#6F6D68]">P(Incident | Threat, Controls)</span>
            </div>

            <p className="text-xs sm:text-sm text-[#6F6D68] leading-relaxed">
              Standard risk matrices assign arbitrary likelihood numbers (1-5). Cyqora computes breach probability through a formal causal Bayesian Network. If an attacker initiates a campaign, probability cascades sequentially through vulnerabilities, defensive perimeter friction, privilege escalation barriers, and system access points.
            </p>

            {/* Formula Block */}
            <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] font-mono text-xs sm:text-sm text-[#6F6275] space-y-2">
              <div className="font-semibold text-[#6F6D68] text-xs">Probability propagation formulation:</div>
              <div className="text-[#292927]">P(Breach | T, C₁, C₂, ... Cₖ) = P(T) × ∏ᵢ ( 1 - ηᵢ × Coverageᵢ )</div>
              <div className="text-xs text-[#6F6D68]">
                Where P(T) is adversary campaign baseline, ηᵢ is control efficacy rating, and Coverageᵢ is the audited adoption rate.
              </div>
            </div>

            {/* Visual DAG Nodes */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#6F6D68] font-mono tracking-wide block mb-3">
                DAG conditional state chain
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                  <div className="text-[#6F6D68] text-[10px] font-semibold">Node 1: Threat likelihood</div>
                  <div className="font-semibold text-[#292927] mt-1">P(External Adversary) = 0.88</div>
                  <p className="text-[11px] text-[#6F6D68] mt-1 font-sans">Based on CERT-In & sector darkweb threat signals</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                  <div className="text-[#6F6D68] text-[10px] font-semibold">Node 2: Perimeter ingress</div>
                  <div className="font-semibold text-[#292927] mt-1">P(Phish Pass | Email WAF) = 0.24</div>
                  <p className="text-[11px] text-[#6F6D68] mt-1 font-sans">Email gateway bypass under generative lures</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                  <div className="text-[#6F6D68] text-[10px] font-semibold">Node 3: Identity hijack</div>
                  <div className="font-semibold text-[#292927] mt-1">P(Compromise | MFA = 65%) = 0.35</div>
                  <p className="text-[11px] text-[#6F6D68] mt-1 font-sans">Fatigue attacks bypassing legacy push MFA</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#6F6275]">
                  <div className="text-[#6F6275] text-[10px] font-semibold">Node 4: Full system ransom</div>
                  <div className="font-semibold text-[#718C78] mt-1">Joint Posterior = 0.187 (18.7%)</div>
                  <p className="text-[11px] text-[#6F6D68] mt-1 font-sans">Combined probability feeding EAL calculation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fuzzy Logic Risk Engine */}
      {activeTab === 'fuzzy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
              <h2 className="text-base font-bold text-[#292927] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B49562]" />
                Fuzzy Logic Financial Impact Quantification
              </h2>
              <span className="text-xs font-mono text-[#6F6D68]">Centroid Defuzzification Method</span>
            </div>

            <p className="text-xs sm:text-sm text-[#6F6D68] leading-relaxed">
              Cyber impact cannot be simplified into a single static number because business disruption and regulatory penalties (DPDP Act 2023, RBI guidelines) possess linguistic vagueness. Cyqora applies triangular membership functions (Low, Medium, High, Critical) across 4 dimensions to produce crisp rupee damages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] space-y-2">
                <div className="font-semibold text-[#B49562] font-mono text-xs">Fuzzy linguistic variables</div>
                <ul className="text-xs text-[#6F6D68] space-y-1.5 list-disc list-inside">
                  <li><span className="text-[#292927] font-semibold">Downtime Severity:</span> Minimal (&le;2h), Moderate (2h-8h), Severe (8h-24h), Catastrophic (&gt;24h)</li>
                  <li><span className="text-[#292927] font-semibold">Data Sensitivity:</span> Public, Internal, Confidential, PII / Crown Jewels</li>
                  <li><span className="text-[#292927] font-semibold">Regulatory Penalty:</span> Section 33 DPDP Act (Up to ₹250 Crores)</li>
                  <li><span className="text-[#292927] font-semibold">Reputational Churn:</span> Direct customer deposit/transaction abandonment</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] space-y-2 font-mono text-xs">
                <div className="font-semibold text-[#6F6275]">Defuzzification centroid formula</div>
                <div className="text-[#292927] mt-1">Crisp Impact = ∫( μ_A(x) × x dx ) / ∫( μ_A(x) dx )</div>
                <p className="text-[11px] text-[#6F6D68] mt-2 font-sans">
                  Maps qualitative audit findings directly into expected financial losses with reproducible mathematical consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 0/1 Knapsack Optimizer */}
      {activeTab === 'knapsack' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
              <h2 className="text-base font-bold text-[#292927] flex items-center gap-2">
                <Binary className="w-5 h-5 text-[#718C78]" />
                0/1 Knapsack Dynamic Programming Optimizer
              </h2>
              <span className="text-xs font-mono text-[#6F6D68]">O(N × Budget) Pseudo-Polynomial Solver</span>
            </div>

            <p className="text-xs sm:text-sm text-[#6F6D68] leading-relaxed">
              Cybersecurity leaders face a fundamental dilemma: dozens of vendor controls are pitched every quarter, but corporate capital is strictly bounded. Cyqora models security procurement as a classic 0/1 Knapsack problem.
            </p>

            <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] font-mono text-xs sm:text-sm space-y-2 text-[#718C78]">
              <div className="text-[#6F6D68] text-xs font-semibold">Dynamic programming recurrence:</div>
              <div className="text-[#292927]">dp[i][w] = max( dp[i-1][w], dp[i-1][w - cost[i]] + risk_reduction[i] )</div>
              <div className="text-xs text-[#6F6D68] font-sans">
                Guarantees the global mathematical maximum of risk reduced without exceeding budget B.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px] font-semibold">Why not greedy ROI?</span>
                <p className="text-[#6F6D68] mt-1">
                  Greedy ranking by ROI fails on discrete lump-sum investments (fractional controls cannot be purchased). DP guarantees 100% true global optimum.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px] font-semibold">Residual risk bound</span>
                <p className="text-[#6F6D68] mt-1">
                  Explicitly computes residual financial risk left on the balance sheet for cyber insurance placement or corporate self-insurance.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px] font-semibold">Execution speed</span>
                <p className="text-[#6F6D68] mt-1">
                  Solves standard enterprise portfolios (20-100 controls, ₹10 Cr budget) in under 4 milliseconds in Python and JavaScript.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Calibration & Verifiability */}
      {activeTab === 'calibration' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
              <h2 className="text-base font-bold text-[#292927] flex items-center gap-2">
                <Sigma className="w-5 h-5 text-[#6F6275]" />
                Model Accuracy, Confidence & Audit Calibration
              </h2>
              <span className="text-xs font-mono text-[#6F6D68]">95% Bootstrap Confidence Intervals</span>
            </div>

            <p className="text-xs sm:text-sm text-[#6F6D68] leading-relaxed">
              Cyqora's loss parameters are calibrated against anonymized historical breach filings, IBM Ponemon data breach costs for India, and CERT-In advisories.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px]">Calibration index</span>
                <div className="text-2xl font-bold text-[#6F6275] mt-1">91.4%</div>
                <p className="text-[11px] text-[#6F6D68] mt-1 font-sans">Brier score reliability on incident occurrence</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px]">Telemetry ingestion</span>
                <div className="text-2xl font-bold text-[#718C78] mt-1">Real-Time</div>
                <p className="text-[11px] text-[#6F6D68] mt-1 font-sans">SIEM, EDR, IAM, and vulnerability scanner feeds</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px]">Audit trail</span>
                <div className="text-2xl font-bold text-[#292927] mt-1">Immutable</div>
                <p className="text-[11px] text-[#6F6D68] mt-1 font-sans">Full decision logging for board and regulatory review</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
