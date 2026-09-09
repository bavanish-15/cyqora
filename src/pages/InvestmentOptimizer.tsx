import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CONTROLS_CATALOG_DATA } from '../data/demoData';
import { formatKnapsackCurrency } from '../utils/formatters';
import { Briefcase, PiggyBank, TrendingUp, Gauge, ShieldCheck } from 'lucide-react';

export const InvestmentOptimizer: React.FC = () => {
  const {
    budget,
    setBudget,
    optimizationResult,
  } = useApp();

  const baselineEal = 13670000; // ₹1.37 Cr baseline EAL

  // Identify selected control IDs from optimization result
  const selectedIds = useMemo(() => {
    return new Set(optimizationResult.selected_controls.map(c => c.id));
  }, [optimizationResult.selected_controls]);

  // Combine and sort all controls by ROI descending as shown in the screenshot
  const allControlsSorted = useMemo(() => {
    return [...CONTROLS_CATALOG_DATA].sort((a, b) => b.roi - a.roi);
  }, []);

  const deployed = optimizationResult.total_cost;
  const unallocated = optimizationResult.remaining_budget;
  const totalRiskReduction = optimizationResult.total_risk_reduction;
  const portfolioRoi = optimizationResult.roi;
  const residualEal = optimizationResult.residual_risk;

  const deployedPct = budget > 0 ? Math.min(100, Math.round((deployed / budget) * 100)) : 0;
  const residualPct = baselineEal > 0 ? Math.min(100, Math.max(4, (residualEal / baselineEal) * 100)) : 0;

  // Slider bounds: ₹10 Lakhs to ₹2.00 Crores in ₹1 Lakh steps
  const minBudget = 1000000; // ₹10 L
  const maxBudget = 20000000; // ₹2.00 Cr
  const sliderFillPct = Math.min(100, Math.max(0, ((budget - minBudget) / (maxBudget - minBudget)) * 100));

  return (
    <div className="pb-16 pt-2">
      <div className="max-w-4xl mx-auto p-5 sm:p-7 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-5">
        
        {/* Header Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#292927]">
            Recommended investment
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] font-mono">
            Deterministic 0/1 Knapsack — maximize Σ(Rᵢ·Xᵢ) subject to Σ(Cᵢ·Xᵢ) ≤ B
          </p>

          {/* Model Specification Tag */}
          <div className="pt-2">
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg border border-[#DCDAD4] bg-[#F1F0EC] text-[#718C78] text-[10px] sm:text-[11px] font-mono tracking-wide font-medium">
              Deterministic 0/1 knapsack — DP in ₹1 lakh units · 8% residual floor
            </div>
          </div>
        </div>

        {/* Security Budget Slider Box */}
        <div className="p-5 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#292927]">
              Security Budget
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#6F6275]">
              {formatKnapsackCurrency(budget)}
            </span>
          </div>

          {/* Glowing Slider */}
          <div className="relative py-1">
            <input
              type="range"
              min={minBudget}
              max={maxBudget}
              step={100000} // 1 Lakh = 1 DP Unit
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="slider-knapsack w-full cursor-pointer focus:outline-none"
              style={{
                background: `linear-gradient(to right, #6F6275 0%, #6F6275 ${sliderFillPct}%, #1E293B ${sliderFillPct}%, #1E293B 100%)`
              }}
            />
          </div>

          <p className="text-[11px] text-[#6F6D68] font-mono">
            Drag to re-run the constrained optimizer. ₹1 Lakh = 1 DP unit; selection is exact, not ranked by ROI.
          </p>
        </div>

        {/* 2x2 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card 1: DEPLOYED */}
          <div className="p-4 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] space-y-0.5">
            <div className="flex items-center space-x-1.5 text-[#6F6D68] text-[10px] font-mono tracking-wide mb-1 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-[#6F6275]" />
              <span>Deployed</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#6F6275]">
              {formatKnapsackCurrency(deployed)}
            </div>
            <div className="text-xs text-[#6F6D68] pt-0.5 font-mono">
              {deployedPct}% of budget
            </div>
          </div>

          {/* Card 2: UNALLOCATED */}
          <div className="p-4 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] space-y-0.5">
            <div className="flex items-center space-x-1.5 text-[#6F6D68] text-[10px] font-mono tracking-wide mb-1 font-medium">
              <PiggyBank className="w-3.5 h-3.5 text-[#6F6D68]" />
              <span>Unallocated</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#292927]">
              {formatKnapsackCurrency(unallocated)}
            </div>
            <div className="text-xs text-[#6F6D68] pt-0.5 font-mono">
              reserve
            </div>
          </div>

          {/* Card 3: RISK REDUCTION */}
          <div className="p-4 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] space-y-0.5">
            <div className="flex items-center space-x-1.5 text-[#6F6D68] text-[10px] font-mono tracking-wide mb-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#718C78]" />
              <span>Risk reduction</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#718C78]">
              {formatKnapsackCurrency(totalRiskReduction)}
            </div>
            <div className="text-xs text-[#6F6D68] pt-0.5 font-mono">
              modeled EAL avoided / yr
            </div>
          </div>

          {/* Card 4: PORTFOLIO ROI */}
          <div className="p-4 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] space-y-0.5">
            <div className="flex items-center space-x-1.5 text-[#6F6D68] text-[10px] font-mono tracking-wide mb-1 font-medium">
              <Gauge className="w-3.5 h-3.5 text-[#B49562]" />
              <span>Portfolio ROI</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#B49562]">
              {portfolioRoi.toFixed(2)}×
            </div>
            <div className="text-xs text-[#6F6D68] pt-0.5 font-mono">
              reduction ÷ cost
            </div>
          </div>
        </div>

        {/* Baseline vs Optimized Annual Loss Card */}
        <div className="p-5 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] space-y-4">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wide text-[#292927] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#6F6275]" />
            <span>Baseline vs optimized annual loss</span>
          </div>

          {/* Baseline EAL Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6F6D68] font-medium">Baseline EAL</span>
              <span className="font-mono font-bold text-[#A87570]">
                {formatKnapsackCurrency(baselineEal)}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#F7F6F2] overflow-hidden">
              <div className="h-full rounded-full bg-[#A87570] w-full" />
            </div>
          </div>

          {/* Residual After Portfolio Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6F6D68] font-medium">Residual after portfolio</span>
              <span className="font-mono font-bold text-[#718C78]">
                {formatKnapsackCurrency(residualEal)}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#F7F6F2] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#718C78] transition-all duration-300"
                style={{ width: `${residualPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls Investment Portfolio Table */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DCDAD4] text-[10px] font-mono tracking-wide text-[#6F6D68] bg-[#F1F0EC]">
                  <th className="py-3 px-4 sm:px-6">Control</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Cost</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Risk reduction</th>
                  <th className="py-3 px-3 sm:px-4 text-right">ROI</th>
                  <th className="py-3 px-4 sm:px-6">Threats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDAD4] text-xs">
                {allControlsSorted.map((control) => {
                  const isSelected = selectedIds.has(control.id);
                  return (
                    <tr
                      key={control.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-[#6F6275]/5 hover:bg-[#6F6275]/10'
                          : 'bg-transparent text-[#6F6D68] hover:bg-[#F1F0EC]/40'
                      }`}
                    >
                      {/* Control Name with Status Dot and Category */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-start space-x-2.5">
                          <span
                            className={`mt-1.5 inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                              isSelected
                                ? 'bg-[#718C78]'
                                : 'bg-[#6F6D68]/40'
                            }`}
                          />
                          <div>
                            <div className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-[#292927]' : 'text-[#6F6D68]'}`}>
                              {control.name}
                            </div>
                            <div className="text-[11px] text-[#6F6D68] mt-0.5 font-mono">
                              {control.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-medium text-[#6F6D68]">
                        {formatKnapsackCurrency(control.cost)}
                      </td>

                      {/* Risk Reduction */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-semibold text-[#718C78]">
                        {formatKnapsackCurrency(control.risk_reduction)}
                      </td>

                      {/* ROI */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-semibold text-[#B49562]">
                        {control.roi.toFixed(2)}×
                      </td>

                      {/* Threats Tags */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {control.threats && control.threats.length > 0 ? (
                            control.threats.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6D68] whitespace-nowrap"
                              >
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-[#6F6D68] font-mono">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
