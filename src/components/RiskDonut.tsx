import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ThreatVector } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import { CHART_SERIES } from '../utils/themeColors';
import { PieChart as PieIcon, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RiskDonutProps {
  threats: ThreatVector[];
  totalExposure: number;
}

const COLORS = [...CHART_SERIES];

export const RiskDonut: React.FC<RiskDonutProps> = ({ threats, totalExposure }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const selectedThreat = threats[activeIndex] || threats[0];

  const chartData = threats.map((t, idx) => ({
    name: t.name,
    value: t.percentage_share,
    color: COLORS[idx % COLORS.length],
    raw: t,
  }));

  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
        <div className="flex items-center space-x-2">
          <PieIcon className="w-4 h-4 text-[#6F6275]" />
          <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
            Exposure Allocation
          </h3>
        </div>
        <span className="text-xs text-[#6F6D68] font-mono">
          Top 6 Attack Vectors
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-3">
        {/* Donut Chart */}
        <div className="md:col-span-6 relative h-60 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="px-3 py-2 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] shadow-sm text-xs">
                        <span className="font-bold text-[#292927]">{item.name}</span>
                        <div className="text-[#6F6275] font-mono font-medium">{item.value}% Share</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                onClick={(_, index) => setActiveIndex(index)}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={index === activeIndex ? '#6F6275' : '#FFFFFF'}
                    strokeWidth={index === activeIndex ? 2 : 1}
                    className="transition-all duration-200 hover:opacity-90"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Stats */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl sm:text-2xl font-bold text-[#292927] font-mono tracking-tight">
              {formatINR(totalExposure)}
            </span>
            <span className="text-[10px] font-medium tracking-wide text-[#6F6D68]">
              Total exposure
            </span>
          </div>
        </div>

        {/* Legend / Selected Detail Panel */}
        <div className="md:col-span-6 space-y-3">
          {/* Segment Selector Badges */}
          <div className="grid grid-cols-2 gap-1.5">
            {chartData.map((item, idx) => (
              <button
                key={item.name}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-[#6F6275]/15 border border-[#6F6275]/40 text-[#292927]'
                    : 'bg-[#F1F0EC] border border-[#DCDAD4] hover:bg-[#E9E7E1] text-[#6F6D68]'
                }`}
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate font-medium text-[#292927]">{item.name}</span>
                </div>
                <span className="font-mono font-medium text-[#6F6D68] ml-1">
                  {item.value}%
                </span>
              </button>
            ))}
          </div>

          {/* Interactive Selected Vector Detail Card */}
          {selectedThreat && (
            <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#292927]">{selectedThreat.name} Deep Dive</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#A87570]/10 border border-[#A87570]/20 text-[#A87570] font-mono font-medium">
                  {formatINR(selectedThreat.financial_impact)}
                </span>
              </div>
              <p className="text-[11px] text-[#6F6D68]">
                <span className="text-[#6F6D68] font-medium">Recommended:</span> {selectedThreat.recommended_control}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-[#DCDAD4] text-[10px] text-[#6F6D68]">
                <span>EAL: {formatINR(selectedThreat.expected_annual_loss)}</span>
                <Link
                  to="/risk-exposure"
                  className="text-[#6F6275] hover:text-[#71859A] font-medium flex items-center gap-0.5"
                >
                  View Exposure Breakdown <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
