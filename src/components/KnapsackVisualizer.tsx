import React from 'react';
import { SecurityControl } from '../types';
import { formatINR } from '../utils/formatters';
import { Calculator, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface KnapsackVisualizerProps {
  budget: number;
  totalCost: number;
  remainingBudget: number;
  selectedControls: SecurityControl[];
  unselectedControls: SecurityControl[];
}

export const KnapsackVisualizer: React.FC<KnapsackVisualizerProps> = ({
  budget,
  totalCost,
  remainingBudget,
  selectedControls,
  unselectedControls,
}) => {
  const budgetUtilizationPct = Math.min(100, (totalCost / budget) * 100);

  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
      {/* Header and Mathematical Objective */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCDAD4] gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6275]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
              0/1 Knapsack Portfolio Optimization Model
            </h3>
            <p className="text-xs text-[#6F6D68]">
              Deterministic dynamic programming allocation under discrete capital limits
            </p>
          </div>
        </div>

        {/* Math Formulas */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <div className="px-2.5 py-1 rounded bg-[#F7F6F2] border border-[#DCDAD4] text-[#6F6D68]">
            <span className="text-[#6F6D68] mr-1">Constraint:</span>
            <span>&Sigma;(C&#7522; &times; X&#7522;) &le; B</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#F7F6F2] border border-[#DCDAD4] text-[#6F6275]">
            <span className="text-[#6F6D68] mr-1">Objective:</span>
            <span>Max &Sigma;(R&#7522; &times; X&#7522;)</span>
          </div>
        </div>
      </div>

      {/* Visual Knapsack Capacity Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-[#6F6D68] font-medium">
            Knapsack Budget Capacity: {formatINR(totalCost)} / {formatINR(budget)}
          </span>
          <span className="text-[#718C78] font-medium">
            {budgetUtilizationPct.toFixed(1)}% Packed ({formatINR(remainingBudget)} Free)
          </span>
        </div>

        {/* Stacked Control Capacity Visualizer */}
        <div className="w-full h-8 rounded-lg bg-[#F7F6F2] border border-[#DCDAD4] p-1 flex items-center gap-1 overflow-hidden">
          {selectedControls.map((c) => {
            const widthPct = Math.max(5, (c.cost / budget) * 100);
            return (
              <div
                key={c.id}
                style={{ width: `${widthPct}%` }}
                title={`${c.name}: ${formatINR(c.cost)}`}
                className="h-full rounded bg-[#6F6275] flex items-center justify-center text-[10px] text-white font-bold px-1 truncate transition-opacity hover:opacity-90 cursor-pointer"
              >
                <span className="truncate">{c.name.split(' ')[0]}</span>
              </div>
            );
          })}
          {remainingBudget > 0 && (
            <div
              style={{ width: `${(remainingBudget / budget) * 100}%` }}
              className="h-full rounded bg-[#F1F0EC] border border-dashed border-[#D0CEC6] flex items-center justify-center text-[9px] text-[#6F6D68] font-mono px-1"
            >
              Surplus
            </div>
          )}
        </div>
      </div>

      {/* Selected vs Excluded Control Blocks */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#6F6D68] tracking-wide font-mono">
          Portfolio allocation blocks ({selectedControls.length} chosen)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {selectedControls.map(c => (
            <div
              key={c.id}
              className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#6F6275]/30 text-xs flex flex-col justify-between space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="w-1.5 h-1.5 rounded-full bg-[#718C78]" />
                <span className="font-mono text-[10px] text-[#718C78] font-medium">{c.roi}x ROI</span>
              </div>
              <div className="font-medium text-[#292927] truncate text-[11px]">{c.name}</div>
              <div className="flex items-center justify-between font-mono text-[10px] text-[#6F6D68] pt-1 border-t border-[#DCDAD4]">
                <span>Cost: {formatINR(c.cost, { decimals: 0 })}</span>
                <span className="text-[#718C78]">-{formatINR(c.risk_reduction, { decimals: 0 })}</span>
              </div>
            </div>
          ))}

          {unselectedControls.slice(0, 3).map(c => (
            <div
              key={c.id}
              className="p-2.5 rounded-lg bg-[#F7F6F2] border border-[#DCDAD4] text-xs flex flex-col justify-between space-y-1 opacity-60"
            >
              <div className="flex items-center justify-between">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6F6D68]" />
                <span className="font-mono text-[10px] text-[#6F6D68]">{c.decision}</span>
              </div>
              <div className="font-medium text-[#6F6D68] truncate text-[11px]">{c.name}</div>
              <div className="flex items-center justify-between font-mono text-[10px] text-[#6F6D68] pt-1 border-t border-[#DCDAD4]">
                <span>Cost: {formatINR(c.cost, { decimals: 0 })}</span>
                <span>{c.roi}x</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
