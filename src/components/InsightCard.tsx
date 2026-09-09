import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, AlertCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';

export const InsightCard: React.FC = () => {
  const { optimizationResult, simResult, budget } = useApp();
  const [showExplainability, setShowExplainability] = useState(false);

  const portfolioROI = optimizationResult.roi;

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3.5 border-b border-[#DCDAD4] gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] flex items-center justify-center text-[#6F6275]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide flex items-center gap-2">
              ✦ Decision brief
              <span className="w-1.5 h-1.5 rounded-full bg-[#6F6275]" />
            </h3>
            <span className="text-[10px] text-[#6F6D68] font-mono">
              Bayesian Probability Decomposition & Dynamic Programming Optimizer
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[#718C78] font-medium">
            Confidence: 91%
          </span>
          <span className="px-2.5 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6275] font-medium">
            Actuarial grade
          </span>
        </div>
      </div>

      {/* Decision Summary Text */}
      <div className="text-sm text-[#6F6D68] leading-relaxed space-y-2">
        <p>
          <span className="font-semibold text-[#292927]">Ransomware</span> and <span className="font-semibold text-[#292927]">Data Breach</span> account for <span className="text-[#6F6275] font-medium font-mono">70%</span> of current enterprise financial exposure.
        </p>
        <p className="text-xs sm:text-sm text-[#6F6D68]">
          The highest marginal risk reduction per ₹ invested comes from:
          <span className="text-[#718C78] font-medium"> 1. MFA</span>,
          <span className="text-[#718C78] font-medium"> 2. Backup Resilience</span>, and
          <span className="text-[#718C78] font-medium"> 3. Network Segmentation</span>.
        </p>
        <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-xs text-[#6F6D68] flex items-center justify-between">
          <span className="text-[#6F6D68] font-medium">Recommended Action:</span>
          <span className="font-medium text-[#6F6275] font-mono">Allocate ₹58 Lakh to the top three controls</span>
        </div>
      </div>

      {/* 3 Metric Insight Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#DCDAD4] text-xs">
        <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] flex items-start space-x-2.5">
          <Zap className="w-4 h-4 text-[#B49562] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[#6F6D68] text-[10px] font-mono">Highest return control</div>
            <div className="font-medium text-[#292927] mt-0.5 font-mono">FIDO2 MFA (4.83x Return)</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-[#718C78] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[#6F6D68] text-[10px] font-mono">Optimized risk reduction</div>
            <div className="font-medium text-[#718C78] mt-0.5 font-mono">{formatINR(optimizationResult.total_risk_reduction)}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-[#6F6275] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[#6F6D68] text-[10px] font-mono">Residual liability floor</div>
            <div className="font-medium text-[#292927] mt-0.5 font-mono">{formatINR(optimizationResult.residual_risk)}</div>
          </div>
        </div>
      </div>

      {/* Explainability Accordion Button */}
      <div className="mt-4 pt-3 border-t border-[#DCDAD4]">
        <button
          onClick={() => setShowExplainability(prev => !prev)}
          className="flex items-center space-x-2 text-xs font-medium text-[#6F6275] hover:text-[#71859A] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why this control? (Explainability)</span>
          {showExplainability ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showExplainability && (
          <div className="mt-3 p-3.5 rounded-lg bg-[#F7F6F2] border border-[#DCDAD4] text-xs space-y-2 text-[#6F6D68]">
            <div className="font-medium text-[#292927] font-mono text-[11px]">
              Actuarial rationale for prioritizing phishing-resistant MFA & backups:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#6F6D68] font-mono text-[11px]">
              <li>Account compromise vectors currently contribute <span className="text-[#292927] font-medium">₹42.0 Lakhs</span> in direct credential exposure.</li>
              <li>FIDO2 MFA reduces credential-based compromise probability from 18.7% down to 3.2%.</li>
              <li>Current audited organizational MFA coverage is only 65%, leaving a 35% vulnerable perimeter.</li>
              <li>Estimated unit investment cost: <span className="text-[#292927] font-medium">₹12.0 Lakhs</span>.</li>
              <li>Modeled risk reduction: <span className="text-[#718C78] font-medium">₹58.0 Lakhs</span> in avoided liability.</li>
              <li>Computed control ROI: <span className="text-[#6F6275] font-medium">4.83x</span>, dominating all other security alternatives.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Action Links */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DCDAD4]">
        <span className="text-xs text-[#6F6D68]">
          Want to test different budget constraints before capital allocation?
        </span>
        <div className="flex items-center space-x-3">
          <Link
            to="/investment"
            className="text-xs font-medium text-[#6F6275] hover:text-[#71859A] flex items-center gap-1 transition-colors"
          >
            Adjust Budget <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/simulator"
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#6F6275] text-white hover:bg-[#71859A] flex items-center gap-1 transition-colors"
          >
            Run What-If <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
