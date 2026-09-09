import React, { useState } from 'react';
import {
  ShieldAlert,
  Binary,
  Coins,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useApp } from '../context/AppContext';

export const RiskToInvestmentFlow: React.FC = () => {
  const { riskProfile, optimizationResult, budget } = useApp();
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const flowNodes = [
    {
      id: 1,
      title: 'Technical risk',
      metric: '72 / 100',
      tag: 'CVSS & telemetry',
      color: 'red',
      desc: 'Raw technical vulnerability scores aggregated across 12 infrastructure assets. High severity gaps in MFA and perimeter segmentation.',
      formula: 'Score = Σ (Asset Criticality × Unpatched Exploit Depth)'
    },
    {
      id: 2,
      title: 'Probability',
      metric: '18.7%',
      tag: 'Bayesian DAG',
      color: 'amber',
      desc: 'Causal DAG model calculates conditional probability of adversary compromise propagating from phishing to domain takeover.',
      formula: 'P(Incident | Threat, Controls) = P(T) × ∏ (1 - ηᵢ × Coverageᵢ)'
    },
    {
      id: 3,
      title: 'Financial exposure',
      metric: formatINR(riskProfile.total_exposure),
      tag: 'Enterprise liability',
      color: 'red',
      desc: 'Translates technical incident into statutory penalties (DPDP Act 2023 up to ₹250 Cr), downtime revenue loss, forensic triage, and recovery fees.',
      formula: 'Exposure = Forensic + Downtime Loss + DPDP Fines + Ransom Liability'
    },
    {
      id: 4,
      title: 'Budget optimizer',
      metric: formatINR(budget),
      tag: '0/1 knapsack DP',
      color: 'cyan',
      desc: 'Deterministic dynamic programming algorithm allocates constrained capital into ₹1 Lakh units to guarantee global optimum risk reduction.',
      formula: 'Maximize Σ(Rᵢ · Xᵢ) subject to Σ(Cᵢ · Xᵢ) ≤ Budget, Xᵢ ∈ {0, 1}'
    },
    {
      id: 5,
      title: 'Optimal portfolio',
      metric: `${optimizationResult.selected_controls.length} Controls Funded`,
      tag: 'MFA + EDR + Backup',
      color: 'emerald',
      desc: 'Selected controls providing highest marginal actuarial risk reduction per rupee invested: FIDO2 MFA, Immutable Backups, EDR, and Microsegmentation.',
      formula: 'Funded = { FIDO2 MFA, Backup Resilience, EDR, Network Segmentation }'
    },
    {
      id: 6,
      title: 'Risk reduction',
      metric: `↓ ${formatINR(optimizationResult.total_risk_reduction)}`,
      tag: `${optimizationResult.roi.toFixed(2)}x portfolio ROI`,
      color: 'emerald',
      desc: `Capital expenditure generates ${optimizationResult.roi.toFixed(2)}x return in financial liability mitigated. Residual exposure lowered to ${formatINR(optimizationResult.residual_risk)}.`,
      formula: 'Portfolio ROI = Total Risk Mitigated ÷ Total Deployed Capital'
    }
  ];

  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3 border-b border-[#DCDAD4] gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#6F6275]" />
          <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
            How technical risk becomes financial exposure
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#6F6275] font-medium">
          The Cyqora decision pipeline
        </span>
      </div>

      {/* Horizontal Interactive Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {flowNodes.map((node) => {
          const isSelected = activeNode === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setActiveNode(isSelected ? null : node.id)}
              className={`p-3 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-[#6F6275]/15 border-[#6F6275]/50 shadow-xs'
                  : 'bg-[#F1F0EC] border-[#DCDAD4] hover:bg-[#E9E7E1]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                    isSelected ? 'bg-[#6F6275] text-white' : 'bg-[#F7F6F2] border border-[#DCDAD4] text-[#6F6D68]'
                  }`}>
                    {node.id}
                  </span>
                  <span className="text-[9px] font-mono font-medium text-[#6F6D68] truncate max-w-[80px]">
                    {node.tag}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-[#6F6D68] mt-2 tracking-wide">
                  {node.title}
                </div>

                <div className={`text-sm sm:text-base font-bold font-mono mt-0.5 tracking-tight ${
                  node.color === 'emerald' ? 'text-[#718C78]' :
                  node.color === 'red' ? 'text-[#A87570]' :
                  node.color === 'amber' ? 'text-[#B49562]' :
                  'text-[#6F6275]'
                }`}>
                  {node.metric}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#DCDAD4] flex items-center justify-between text-[10px] text-[#6F6D68] group-hover:text-[#6F6275] transition-colors">
                <span className="font-mono">Actuarial Logic</span>
                <HelpCircle className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Contextual Explanation Drawer */}
      {activeNode !== null && (
        <div className="mt-3 p-3.5 rounded-lg bg-[#F7F6F2] border border-[#6F6275]/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#6F6275] font-mono">
                Stage {flowNodes[activeNode - 1].id}: {flowNodes[activeNode - 1].title}
              </span>
              <span className="text-[#6F6D68]">•</span>
              <span className="text-[#6F6D68]">{flowNodes[activeNode - 1].desc}</span>
            </div>
            <div className="text-[11px] font-mono text-[#6F6D68]">
              <span className="text-[#6F6D68] font-medium">Mathematical basis: </span>
              <span className="text-[#6F6275] font-medium">{flowNodes[activeNode - 1].formula}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveNode(null)}
            className="p-1 rounded text-[#6F6D68] hover:text-[#292927] self-end sm:self-auto cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
