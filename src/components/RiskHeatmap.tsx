import React, { useState } from 'react';
import { ThreatVector } from '../types';
import { formatINR, formatPercent, formatProbability } from '../utils/formatters';
import { AlertTriangle, ShieldAlert, Sparkles, Info, X, Target } from 'lucide-react';

interface RiskHeatmapProps {
  threats: ThreatVector[];
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ threats }) => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatVector | null>(threats[0] || null);

  // Map each threat into matrix coordinates (x: Likelihood [1..3], y: Impact [1..3])
  // Likelihood: Low (<0.10: 1), Med (0.10-0.20: 2), High (>0.20: 3)
  // Impact: Low (< ₹1 Cr: 1), Med (₹1-2 Cr: 2), High (> ₹2 Cr: 3)
  const getCoordinates = (t: ThreatVector) => {
    let x = 2;
    if (t.probability < 0.10) x = 1;
    else if (t.probability > 0.20) x = 3;

    let y = 2;
    if (t.financial_impact < 10000000) y = 1;
    else if (t.financial_impact > 20000000) y = 3;

    return { x, y };
  };

  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#6F6275]" />
            <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
              Risk drivers
            </h3>
          </div>
          <p className="text-[11px] text-[#6F6D68] mt-0.5">
            Likelihood × Financial Impact enterprise distribution
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6D68] font-medium">
          Actuarial mapping
        </span>
      </div>

      {/* Heatmap Matrix Grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <div className="flex">
            {/* Y-axis label */}
            <div className="flex flex-col justify-between items-center py-6 pr-3 text-[10px] font-medium text-[#6F6D68] tracking-wide">
              <span className="transform -rotate-90 origin-center whitespace-nowrap">High impact</span>
              <span className="transform -rotate-90 origin-center whitespace-nowrap">Med impact</span>
              <span className="transform -rotate-90 origin-center whitespace-nowrap">Low impact</span>
            </div>

            {/* 3x3 Matrix Grid */}
            <div className="flex-1 grid grid-rows-3 gap-1.5 h-64 sm:h-72">
              {/* Row 3 (High Impact) */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* Low Prob, High Impact */}
                <div className="p-2 rounded-lg bg-[#B49562]/5 border border-[#B49562]/15 flex flex-wrap gap-1.5 items-center justify-center relative">
                  {threats.filter(t => getCoordinates(t).x === 1 && getCoordinates(t).y === 3).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
                {/* Med Prob, High Impact */}
                <div className="p-2 rounded-lg bg-[#A87570]/10 border border-[#A87570]/20 flex flex-wrap gap-1.5 items-center justify-center relative">
                  {threats.filter(t => getCoordinates(t).x === 2 && getCoordinates(t).y === 3).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
                {/* High Prob, High Impact (CRITICAL ZONE) */}
                <div className="p-2 rounded-lg bg-[#A87570]/15 border border-[#A87570]/30 flex flex-wrap gap-1.5 items-center justify-center relative">
                  <span className="absolute top-1 right-2 text-[9px] font-semibold text-[#A87570] tracking-wide">
                    Critical zone
                  </span>
                  {threats.filter(t => getCoordinates(t).x === 3 && getCoordinates(t).y === 3).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
              </div>

              {/* Row 2 (Medium Impact) */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* Low Prob, Med Impact */}
                <div className="p-2 rounded-lg bg-[#6F6275]/5 border border-[#DCDAD4] flex flex-wrap gap-1.5 items-center justify-center">
                  {threats.filter(t => getCoordinates(t).x === 1 && getCoordinates(t).y === 2).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
                {/* Med Prob, Med Impact */}
                <div className="p-2 rounded-lg bg-[#B49562]/5 border border-[#B49562]/15 flex flex-wrap gap-1.5 items-center justify-center">
                  {threats.filter(t => getCoordinates(t).x === 2 && getCoordinates(t).y === 2).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
                {/* High Prob, Med Impact */}
                <div className="p-2 rounded-lg bg-[#A87570]/10 border border-[#A87570]/20 flex flex-wrap gap-1.5 items-center justify-center">
                  {threats.filter(t => getCoordinates(t).x === 3 && getCoordinates(t).y === 2).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
              </div>

              {/* Row 1 (Low Impact) */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* Low Prob, Low Impact */}
                <div className="p-2 rounded-lg bg-[#718C78]/5 border border-[#DCDAD4] flex flex-wrap gap-1.5 items-center justify-center">
                  {threats.filter(t => getCoordinates(t).x === 1 && getCoordinates(t).y === 1).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
                {/* Med Prob, Low Impact */}
                <div className="p-2 rounded-lg bg-[#6F6275]/5 border border-[#DCDAD4] flex flex-wrap gap-1.5 items-center justify-center">
                  {threats.filter(t => getCoordinates(t).x === 2 && getCoordinates(t).y === 1).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
                {/* High Prob, Low Impact */}
                <div className="p-2 rounded-lg bg-[#B49562]/5 border border-[#B49562]/15 flex flex-wrap gap-1.5 items-center justify-center">
                  {threats.filter(t => getCoordinates(t).x === 3 && getCoordinates(t).y === 1).map(t => (
                    <ThreatNode key={t.id} threat={t} isSelected={selectedThreat?.id === t.id} onClick={() => setSelectedThreat(t)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="grid grid-cols-3 pl-10 pt-2 text-center text-[10px] font-medium text-[#6F6D68] tracking-wide">
            <span>Low likelihood</span>
            <span>Medium likelihood</span>
            <span>High likelihood</span>
          </div>
        </div>

        {/* Threat Detail Inspector Pane */}
        <div className="lg:col-span-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] p-4 flex flex-col justify-between">
          {selectedThreat ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-wide border ${
                    selectedThreat.severity === 'CRITICAL' ? 'bg-[#A87570]/15 text-[#A87570] border-[#A87570]/30' :
                    selectedThreat.severity === 'HIGH' ? 'bg-[#B49562]/15 text-[#B49562] border-[#B49562]/30' :
                    'bg-[#FFFFFF] text-[#6F6D68] border-[#DCDAD4]'
                  }`}>
                    {selectedThreat.severity.charAt(0) + selectedThreat.severity.slice(1).toLowerCase()} threat
                  </span>
                  <h4 className="text-sm font-bold text-[#292927] mt-1">{selectedThreat.name}</h4>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-[#6F6D68]">P(Incident)</div>
                  <div className="text-[#6F6275] font-medium text-xs">{formatProbability(selectedThreat.probability)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#DCDAD4]">
                  <div className="text-[10px] text-[#6F6D68]">Financial Impact</div>
                  <div className="text-[#A87570] font-medium mt-0.5">{formatINR(selectedThreat.financial_impact)}</div>
                </div>
                <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#DCDAD4]">
                  <div className="text-[10px] text-[#6F6D68]">Expected Annual Loss</div>
                  <div className="text-[#B49562] font-medium mt-0.5">{formatINR(selectedThreat.expected_annual_loss)}</div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] pt-1 border-t border-[#DCDAD4]">
                <div>
                  <span className="text-[#6F6D68]">Primary Weakness: </span>
                  <span className="text-[#292927]">{selectedThreat.primary_vulnerability}</span>
                </div>
                <div>
                  <span className="text-[#6F6D68]">Recommended Control: </span>
                  <span className="text-[#718C78] font-medium">{selectedThreat.recommended_control}</span>
                </div>
                <div>
                  <span className="text-[#6F6D68]">Actuarial Confidence: </span>
                  <span className="text-[#6F6D68] font-mono">{selectedThreat.confidence}% Monte Carlo CI</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-[#6F6D68]">
              Click any threat node in the matrix to inspect quantified metrics.
            </div>
          )}

          <div className="mt-3 pt-2 text-[10px] text-[#6F6D68] font-mono flex items-center justify-between border-t border-[#DCDAD4]">
            <span>● Click node to focus</span>
            <span>6 Vectors Monitored</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ThreatNodeProps {
  threat: ThreatVector;
  isSelected: boolean;
  onClick: () => void;
}

const ThreatNode: React.FC<ThreatNodeProps> = ({ threat, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors flex items-center space-x-1 cursor-pointer ${
        isSelected
          ? 'bg-[#6F6275] text-white shadow-sm scale-105'
          : threat.severity === 'CRITICAL'
          ? 'bg-[#A87570]/15 text-[#A87570] border border-[#A87570]/30 hover:bg-[#A87570]/25'
          : threat.severity === 'HIGH'
          ? 'bg-[#B49562]/15 text-[#B49562] border border-[#B49562]/30 hover:bg-[#B49562]/25'
          : 'bg-[#F1F0EC] text-[#6F6D68] border border-[#DCDAD4] hover:bg-[#1A222D]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#F7F6F2]' : 'bg-current'}`} />
      <span className="truncate max-w-[100px]">{threat.name.split(' ')[0]}</span>
    </button>
  );
};
