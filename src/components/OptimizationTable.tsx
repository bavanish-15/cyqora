import React from 'react';
import { SecurityControl } from '../types';
import { formatINR } from '../utils/formatters';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, Shield, ArrowUpDown } from 'lucide-react';

interface OptimizationTableProps {
  selectedControls: SecurityControl[];
  unselectedControls: SecurityControl[];
}

export const OptimizationTable: React.FC<OptimizationTableProps> = ({
  selectedControls,
  unselectedControls
}) => {
  const allControls = [...selectedControls, ...unselectedControls];

  const getDecisionBadge = (decision: string, isSelected: boolean) => {
    if (isSelected || decision === 'RECOMMENDED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#718C78]/10 text-[#718C78] border border-[#718C78]/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Recommended</span>
        </span>
      );
    }
    if (decision === 'BUDGET CONSTRAINED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#B49562]/10 text-[#B49562] border border-[#B49562]/20">
          <AlertCircle className="w-3 h-3" />
          <span>Budget constrained</span>
        </span>
      );
    }
    if (decision === 'LOW ROI') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F0EC] text-[#6F6D68] border border-[#DCDAD4]">
          <XCircle className="w-3 h-3" />
          <span>Low ROI</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F0EC] text-[#6F6D68] border border-[#DCDAD4]">
        <span>Defer</span>
      </span>
    );
  };

  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#DCDAD4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#6F6275]" />
            <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
              Security controls optimization
            </h3>
          </div>
          <p className="text-xs text-[#6F6D68] mt-0.5">
            Evaluated using 0/1 Knapsack dynamic programming under financial constraints
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-[#718C78] font-medium">
            {selectedControls.length} Selected Portfolio Items
          </span>
          <span className="text-[#6F6D68]">|</span>
          <span className="text-[#6F6D68]">
            {unselectedControls.length} Deferred
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCDAD4] bg-[#F7F6F2] text-[#6F6D68] font-medium tracking-wide text-[11px] font-mono">
              <th className="py-3 px-4">Control</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Deployment Cost</th>
              <th className="py-3 px-4">Risk Reduction</th>
              <th className="py-3 px-4">ROI Efficiency</th>
              <th className="py-3 px-4">Exposure %</th>
              <th className="py-3 px-4">AI Decision</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDAD4]">
            {allControls.map((c) => {
              const isSelected = c.selected;
              return (
                <tr
                  key={c.id}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-[#6F6275]/5 hover:bg-[#6F6275]/10'
                      : 'hover:bg-[rgba(255,255,255,0.03)] text-[#6F6D68]'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#292927]">{c.name}</div>
                    <div className="text-[10px] text-[#6F6D68] truncate max-w-xs">{c.description}</div>
                  </td>
                  <td className="py-3 px-4 text-[#6F6D68] whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[10px] font-mono">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-[#292927] whitespace-nowrap">
                    {formatINR(c.cost)}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-[#718C78] whitespace-nowrap">
                    {formatINR(c.risk_reduction)}
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      c.roi >= 3.0 ? 'bg-[#718C78]/10 text-[#718C78] border border-[#718C78]/20' :
                      c.roi >= 2.0 ? 'bg-[#6F6275]/10 text-[#6F6275] border border-[#6F6275]/20' :
                      'bg-[#F1F0EC] text-[#6F6D68] border border-[#DCDAD4]'
                    }`}>
                      {c.roi}x
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#6F6D68] whitespace-nowrap">
                    {c.risk_reduction_pct}%
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getDecisionBadge(c.decision, isSelected)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {isSelected ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#718C78]/15 text-[#718C78] border border-[#718C78]/30">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F1F0EC] text-[#6F6D68]">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
