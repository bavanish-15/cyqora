import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatPercent, formatProbability } from '../utils/formatters';
import { Sliders, RotateCcw, ArrowRight, ShieldCheck, TrendingDown, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { simParams, setSimParams, simResult } = useApp();

  const handleSliderChange = (key: keyof typeof simParams, val: number) => {
    setSimParams(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const applyPreset = (preset: {
    mfa: number;
    edr: number;
    seg: number;
    bak: number;
    soc: number;
  }) => {
    setSimParams({
      mfa_coverage: preset.mfa,
      edr_coverage: preset.edr,
      segmentation: preset.seg,
      backup_resilience: preset.bak,
      soc_monitoring: preset.soc,
    });
  };

  const presets = [
    {
      name: 'Default Baseline',
      values: { mfa: 65, edr: 72, seg: 40, bak: 55, soc: 60 },
      desc: 'Current enterprise telemetry',
    },
    {
      name: 'Ransomware Fortress',
      values: { mfa: 100, edr: 95, seg: 60, bak: 98, soc: 80 },
      desc: 'Immutable backups + FIDO2 MFA',
    },
    {
      name: 'Zero Trust Complete',
      values: { mfa: 100, edr: 92, seg: 95, bak: 85, soc: 90 },
      desc: 'Max segmentation & micro-perimeters',
    },
    {
      name: 'High SOC Readiness',
      values: { mfa: 80, edr: 88, seg: 50, bak: 70, soc: 100 },
      desc: 'Sub-15m MTTC 24/7 telemetry',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#6F6275] text-xs font-medium tracking-wide mb-1">
            <Sliders className="w-4 h-4" />
            <span>Dynamic actuarial sensitivity testing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
            What-If Cyber Risk Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] mt-1 max-w-2xl">
            Test how defensive coverage decisions alter probability and financial exposure in real-time before spending actual budget.
          </p>
        </div>

        <button
          onClick={() => applyPreset(presets[0].values)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#F1F0EC] hover:bg-[#E9E7E1] text-[#6F6D68] hover:text-[#292927] border border-[#DCDAD4] text-xs font-medium transition-colors self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p.values)}
            className="p-3 rounded-lg bg-[#FFFFFF] hover:bg-[#F1F0EC] border border-[#DCDAD4] hover:border-[#6F6275]/50 text-left transition-colors group cursor-pointer"
          >
            <div className="font-semibold text-xs text-[#292927] group-hover:text-[#6F6275] transition-colors">
              {p.name}
            </div>
            <div className="text-[10px] text-[#6F6D68] truncate mt-0.5 font-mono">{p.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Simulation Layout: Sliders (Left) vs 2-Column Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5 Interactive Control Sliders */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
            <h3 className="font-semibold text-sm sm:text-base text-[#292927]">
              Defensive Control Coverage Levers
            </h3>
            <span className="text-[11px] text-[#6F6275] font-mono font-medium">
              Live Sensitivity Active
            </span>
          </div>

          {/* Slider 1: MFA Coverage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-[#292927]">MFA Enforced Coverage</span>
                <p className="text-[10px] text-[#6F6D68]">Reduces account hijack & ransomware probability</p>
              </div>
              <span className="text-sm font-bold font-mono text-[#6F6275]">
                {simParams.mfa_coverage}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={simParams.mfa_coverage}
              onChange={(e) => handleSliderChange('mfa_coverage', Number(e.target.value))}
              className="w-full h-1.5 bg-[#F1F0EC] rounded-lg appearance-none cursor-pointer accent-[#6F6275]"
            />
          </div>

          {/* Slider 2: EDR Coverage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-[#292927]">EDR / XDR Endpoint Coverage</span>
                <p className="text-[10px] text-[#6F6D68]">Suppresses initial payload execution and memory exploits</p>
              </div>
              <span className="text-sm font-bold font-mono text-[#6F6275]">
                {simParams.edr_coverage}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={simParams.edr_coverage}
              onChange={(e) => handleSliderChange('edr_coverage', Number(e.target.value))}
              className="w-full h-1.5 bg-[#F1F0EC] rounded-lg appearance-none cursor-pointer accent-[#6F6275]"
            />
          </div>

          {/* Slider 3: Network Segmentation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-[#292927]">Network Micro-Segmentation</span>
                <p className="text-[10px] text-[#6F6D68]">Constrains blast radius and stops east-west lateral spread</p>
              </div>
              <span className="text-sm font-bold font-mono text-[#6F6275]">
                {simParams.segmentation}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={simParams.segmentation}
              onChange={(e) => handleSliderChange('segmentation', Number(e.target.value))}
              className="w-full h-1.5 bg-[#F1F0EC] rounded-lg appearance-none cursor-pointer accent-[#6F6275]"
            />
          </div>

          {/* Slider 4: Backup Resilience */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-[#292927]">Immutable Backup Resilience</span>
                <p className="text-[10px] text-[#6F6D68]">Directly slashes ransomware financial recovery loss</p>
              </div>
              <span className="text-sm font-bold font-mono text-[#6F6275]">
                {simParams.backup_resilience}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={simParams.backup_resilience}
              onChange={(e) => handleSliderChange('backup_resilience', Number(e.target.value))}
              className="w-full h-1.5 bg-[#F1F0EC] rounded-lg appearance-none cursor-pointer accent-[#6F6275]"
            />
          </div>

          {/* Slider 5: 24/7 SOC Monitoring */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-[#292927]">24/7 SOC & MDR Detection</span>
                <p className="text-[10px] text-[#6F6D68]">Shortens dwell time & contains exfiltration attempts</p>
              </div>
              <span className="text-sm font-bold font-mono text-[#6F6275]">
                {simParams.soc_monitoring}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={simParams.soc_monitoring}
              onChange={(e) => handleSliderChange('soc_monitoring', Number(e.target.value))}
              className="w-full h-1.5 bg-[#F1F0EC] rounded-lg appearance-none cursor-pointer accent-[#6F6275]"
            />
          </div>
        </div>

        {/* Right Column: 2-Column Comparison: CURRENT vs SIMULATED STATE */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCDAD4]">
              <h3 className="font-semibold text-sm sm:text-base text-[#292927]">
                Delta Impact: Current vs. Simulated State
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#718C78]/15 text-[#718C78] border border-[#718C78]/30">
                -{simResult.risk_reduction_percentage}% Exposure
              </span>
            </div>

            {/* Side by Side Comparison Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Column 1: Current State */}
              <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] space-y-3 font-mono text-xs">
                <div className="text-[10px] font-semibold text-[#6F6D68] pb-1 border-b border-[#DCDAD4]">
                  Current state
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Financial Exposure</span>
                  <div className="text-lg font-bold text-[#292927]">
                    {formatINR(simResult.baseline_exposure)}
                  </div>
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Expected Annual Loss</span>
                  <div className="text-base font-medium text-[#6F6D68]">
                    {formatINR(simResult.baseline_eal)}
                  </div>
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Incident Probability</span>
                  <div className="text-sm font-medium text-[#6F6D68]">18.7%</div>
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Risk Score Index</span>
                  <div className="text-sm font-semibold text-[#A87570]">82.4 / 100</div>
                </div>
              </div>

              {/* Column 2: Simulated State */}
              <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#718C78]/30 space-y-3 font-mono text-xs">
                <div className="text-[10px] font-semibold text-[#718C78] pb-1 border-b border-[#718C78]/20">
                  Simulated state
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Simulated Exposure</span>
                  <div className="text-lg font-bold text-[#718C78]">
                    {formatINR(simResult.simulated_exposure)}
                  </div>
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Simulated EAL</span>
                  <div className="text-base font-bold text-[#718C78]">
                    {formatINR(simResult.simulated_eal)}
                  </div>
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Simulated Probability</span>
                  <div className="text-sm font-bold text-[#6F6275]">
                    {formatProbability(simResult.incident_probability)}
                  </div>
                </div>

                <div>
                  <span className="text-[#6F6D68] text-[10px]">Simulated Score</span>
                  <div className="text-sm font-bold text-[#718C78]">
                    {simResult.risk_score} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Requirement Indicator */}
            <div className="p-3.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div>
                <span className="text-[#6F6D68] text-[11px]">Estimated Investment Required: </span>
                <span className="text-[#292927] font-bold">{formatINR(simResult.investment_requirement)}</span>
              </div>
              <div className="text-[#718C78] font-medium">
                Net Annual Value Protected: {formatINR(simResult.baseline_eal - simResult.simulated_eal)}
              </div>
            </div>
          </div>

          {/* Dynamic Threat Sensitivity Breakdown */}
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm text-xs">
            <span className="font-semibold text-[#292927] block mb-2">
              Threat Sensitivity Under Active Scenario
            </span>
            <div className="space-y-2">
              {simResult.simulated_threats.slice(0, 3).map((st) => (
                <div
                  key={st.name}
                  className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] flex items-center justify-between text-xs font-mono"
                >
                  <span className="font-medium text-[#292927]">{st.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#718C78] font-medium">-{st.impact_reduction_pct}% Impact</span>
                    <span className="text-[#6F6D68]">{formatINR(st.financial_impact)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
