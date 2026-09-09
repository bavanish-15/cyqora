import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ThreatVector } from '../types';
import { formatINR, formatPercent, formatProbability } from '../utils/formatters';
import { ShieldAlert, Info, ArrowUpRight } from 'lucide-react';

interface RiskBarChartProps {
  threats: ThreatVector[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data: ThreatVector = payload[0].payload;
    return (
      <div className="p-3.5 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] shadow-sm max-w-sm text-xs z-50">
        <div className="flex items-center justify-between pb-2 border-b border-[#DCDAD4]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A87570]" />
            <span className="font-bold text-[#292927] text-sm tracking-wide">{data.name}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
            data.severity === 'CRITICAL' ? 'bg-[#A87570]/10 text-[#A87570] border border-[#A87570]/20' :
            data.severity === 'HIGH' ? 'bg-[#B49562]/10 text-[#B49562] border border-[#B49562]/20' :
            'bg-[#FFFFFF] text-[#6F6D68] border border-[#DCDAD4]'
          }`}>
            {data.severity.charAt(0) + data.severity.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2.5 font-mono">
          <div className="p-2 rounded bg-[#FFFFFF] border border-[#DCDAD4]">
            <div className="text-[10px] text-[#6F6D68]">Incident Probability</div>
            <div className="text-[#6F6275] font-medium text-xs mt-0.5">{formatProbability(data.probability)}</div>
          </div>
          <div className="p-2 rounded bg-[#FFFFFF] border border-[#DCDAD4]">
            <div className="text-[10px] text-[#6F6D68]">Model Confidence</div>
            <div className="text-[#718C78] font-medium text-xs mt-0.5">{data.confidence}% CI</div>
          </div>
          <div className="p-2 rounded bg-[#FFFFFF] border border-[#DCDAD4]">
            <div className="text-[10px] text-[#6F6D68]">Estimated Impact</div>
            <div className="text-[#292927] font-medium text-xs mt-0.5">{formatINR(data.financial_impact)}</div>
          </div>
          <div className="p-2 rounded bg-[#FFFFFF] border border-[#DCDAD4]">
            <div className="text-[10px] text-[#6F6D68]">Expected Annual Loss</div>
            <div className="text-[#6F6275] font-medium text-xs mt-0.5">{formatINR(data.expected_annual_loss)}</div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#DCDAD4] space-y-1 text-[11px]">
          <div>
            <span className="text-[#6F6D68]">Primary Weakness: </span>
            <span className="text-[#6F6D68]">{data.primary_vulnerability}</span>
          </div>
          <div>
            <span className="text-[#6F6275]">Recommended Control: </span>
            <span className="text-[#292927]">{data.recommended_control}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const RiskBarChart: React.FC<RiskBarChartProps> = ({ threats }) => {
  const chartData = threats.map(t => ({
    ...t,
    impactCrores: Number((t.financial_impact / 10000000).toFixed(2)),
    ealCrores: Number((t.expected_annual_loss / 10000000).toFixed(2)),
  }));

  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-2 border-b border-[#DCDAD4] gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#6F6275]" />
            <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
              Financial Cyber Risk Exposure
            </h3>
          </div>
          <p className="text-xs text-[#6F6D68] mt-0.5">
            Comparison of Worst-Case Financial Liability vs. Probabilistic Expected Annual Loss (EAL)
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-[#6F6275]" />
            <span className="text-[#6F6D68] font-medium">Estimated Impact</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-[#6F6D68]" />
            <span className="text-[#6F6D68] font-medium">Expected Annual Loss</span>
          </div>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD4" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#6F6D68"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#DCDAD4' }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#6F6D68"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#DCDAD4' }}
              tickFormatter={(val) => `₹${val} Cr`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Bar
              dataKey="impactCrores"
              name="Estimated Financial Impact"
              fill="#6F6275"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="ealCrores"
              name="Expected Annual Loss"
              fill="#6F6D68"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-[#DCDAD4] flex flex-wrap items-center justify-between text-[11px] text-[#6F6D68]">
        <span className="italic flex items-center gap-1 text-[#6F6D68]">
          <Info className="w-3.5 h-3.5 text-[#6F6275] inline" /> Hover any threat vector to inspect Bayesian probability & control mitigation.
        </span>
        <span className="font-mono text-[#6F6D68] font-medium">Total Evaluated: ₹4.82 Cr</span>
      </div>
    </div>
  );
};
