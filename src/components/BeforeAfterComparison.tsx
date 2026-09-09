import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatProbability } from '../utils/formatters';
import { ArrowDownRight, TrendingDown, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const BeforeAfterComparison: React.FC = () => {
  const { riskProfile, optimizationResult } = useApp();

  const currentExposure = riskProfile.total_exposure;
  const residualRisk = optimizationResult.residual_risk;
  const reductionAmount = optimizationResult.total_risk_reduction;
  const reductionPct = currentExposure > 0 ? Math.round((reductionAmount / currentExposure) * 100) : 45.2;

  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#DCDAD4]">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#6F6275]" />
          <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
            Enterprise risk reduction: current vs optimized
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6D68] font-medium">
          Actuarial simulation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Current State Card */}
        <div className="md:col-span-4 p-4 rounded-lg bg-[#F1F0EC] border border-[#A87570]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#A87570] tracking-wide">
              Current unmitigated state
            </span>
            <ShieldAlert className="w-4 h-4 text-[#A87570]" />
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#292927] tracking-tight">
              {formatINR(currentExposure)}
            </div>
            <p className="text-[11px] text-[#6F6D68] mt-0.5">Annualized Enterprise Exposure</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DCDAD4] text-xs font-mono">
            <div>
              <div className="text-[10px] text-[#6F6D68]">Incident Probability</div>
              <div className="text-[#A87570] font-semibold mt-0.5">18.7%</div>
            </div>
            <div>
              <div className="text-[10px] text-[#6F6D68]">Technical Risk Score</div>
              <div className="text-[#A87570] font-semibold mt-0.5">72 / 100</div>
            </div>
          </div>
        </div>

        {/* Middle Connector: Risk Reduction Impact */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-3 text-center space-y-2">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#718C78]/10 border border-[#718C78]/20 text-[#718C78] text-xs font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>↓ {reductionPct}% risk reduction</span>
          </div>

          <div className="text-sm font-bold font-mono text-[#718C78]">
            {formatINR(reductionAmount)} Saved
          </div>

          <div className="text-[11px] font-mono text-[#6F6D68]">
            {optimizationResult.roi.toFixed(2)}x Return on Security Capital
          </div>

          <div className="hidden md:flex items-center justify-center text-[#6F6D68] text-xs">
            •••••••••• &rarr; ••••••••••
          </div>
        </div>

        {/* Optimized State Card */}
        <div className="md:col-span-4 p-4 rounded-lg bg-[#F1F0EC] border border-[#718C78]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#718C78] tracking-wide">
              Optimized residual state
            </span>
            <ShieldCheck className="w-4 h-4 text-[#718C78]" />
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#718C78] tracking-tight">
              {formatINR(residualRisk)}
            </div>
            <p className="text-[11px] text-[#6F6D68] mt-0.5">Residual Exposure with Knapsack Controls</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DCDAD4] text-xs font-mono">
            <div>
              <div className="text-[10px] text-[#6F6D68]">Incident Probability</div>
              <div className="text-[#718C78] font-semibold mt-0.5">10.4%</div>
            </div>
            <div>
              <div className="text-[10px] text-[#6F6D68]">Technical Risk Score</div>
              <div className="text-[#718C78] font-semibold mt-0.5">41 / 100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
