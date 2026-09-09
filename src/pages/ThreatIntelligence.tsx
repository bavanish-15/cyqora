import React, { useState } from 'react';
import { THREAT_INTELLIGENCE_ITEMS } from '../data/demoData';
import { AttackChainFlow } from '../components/AttackChainFlow';
import { formatINR } from '../utils/formatters';
import { Radio, TrendingUp, TrendingDown, Minus, ShieldAlert, Target, Sparkles, ExternalLink, Activity } from 'lucide-react';
import { ThreatIntelligenceItem } from '../types';

export const ThreatIntelligence: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatIntelligenceItem>(THREAT_INTELLIGENCE_ITEMS[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#6F6275] text-xs font-medium tracking-wide mb-1">
            <Radio className="w-4 h-4" />
            <span>Adversary feeds & global SIEM telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
            Threat Intelligence & MITRE ATT&CK Mapping
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] mt-1">
            Continuous threat telemetry ingestion feeding real-time Bayesian probability updates.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-xs font-mono">
          <Activity className="w-4 h-4 text-[#718C78]" />
          <span className="text-[#6F6D68]">Live CERT-In & ISAC Signals Active</span>
        </div>
      </div>

      {/* Attack Chain Visualization */}
      <AttackChainFlow />

      {/* Active Threat Landscape Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg font-bold text-[#292927] tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#A87570]" />
            Active Threat Landscape
          </h2>
          <p className="text-xs text-[#6F6D68]">
            Adversary campaigns targeting identified enterprise crown jewels
          </p>
        </div>
        <span className="text-xs text-[#6F6D68] font-mono">
          6 Evaluated Attack Campaigns
        </span>
      </div>

      {/* 6 Realistic Threat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {THREAT_INTELLIGENCE_ITEMS.map((item) => {
          const isSelected = selectedThreat.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedThreat(item)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#F1F0EC] border-[#6F6275]'
                  : 'bg-[#FFFFFF] border-[#DCDAD4] hover:border-[#D0CEC6]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-sm text-[#292927] leading-tight">
                    {item.title}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-mono">
                    {item.trend === 'UP' && (
                      <span className="flex items-center text-[#A87570] font-medium">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> UP
                      </span>
                    )}
                    {item.trend === 'DOWN' && (
                      <span className="flex items-center text-[#718C78] font-medium">
                        <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> DOWN
                      </span>
                    )}
                    {item.trend === 'STABLE' && (
                      <span className="flex items-center text-[#6F6D68] font-medium">
                        <Minus className="w-3.5 h-3.5 mr-0.5" /> STABLE
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-xs font-mono space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6F6D68]">Campaign Activity:</span>
                    <span className="text-[#6F6275] font-medium">{item.activity}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6F6D68]">Likelihood:</span>
                    <span className="text-[#B49562] font-medium">{item.likelihood}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6F6D68]">Potential Liability:</span>
                    <span className="text-[#A87570] font-bold">{formatINR(item.potential_impact)}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6F6D68] mt-2.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#DCDAD4] flex items-center justify-between text-[10px] text-[#6F6D68] font-mono">
                <span className="truncate max-w-[170px]" title={item.targeted_assets}>
                  Target: {item.targeted_assets.split(',')[0]}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6275] font-medium">
                  {item.mitre_technique.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Deep Dive Dossier */}
      {selectedThreat && (
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#6F6275]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCDAD4] gap-2">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#A87570]" />
              <h3 className="text-base font-bold text-[#292927] tracking-wide">
                Intelligence Brief: {selectedThreat.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#6F6275] bg-[#F1F0EC] px-2.5 py-1 rounded-md border border-[#DCDAD4] font-medium">
              MITRE ATT&CK: {selectedThreat.mitre_technique}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#6F6D68] leading-relaxed">
            {selectedThreat.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Targeted assets</span>
              <div className="font-semibold text-[#292927] text-xs mt-0.5">{selectedThreat.targeted_assets}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Telemetry intensity</span>
              <div className="font-semibold text-[#6F6275] text-xs mt-0.5">{selectedThreat.activity}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Estimated exposure</span>
              <div className="font-bold text-[#A87570] text-xs mt-0.5">{formatINR(selectedThreat.potential_impact)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
