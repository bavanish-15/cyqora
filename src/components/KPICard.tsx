import React from 'react';
import {
  TrendingUp,
  AlertOctagon,
  Calculator,
  ShieldCheck,
  Wallet,
  ArrowUpRight,
  Sparkles,
  Info,
  TrendingDown
} from 'lucide-react';
import { formatINR, formatPercent } from '../utils/formatters';
import { useApp } from '../context/AppContext';

// 1. Dominant Financial Exposure Hero Component
export const PrimaryFinancialHero: React.FC = () => {
  const { riskProfile } = useApp();
  const totalExposure = riskProfile.total_exposure;

  return (
    <div className="p-6 sm:p-7 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#A87570]" />
            <span className="text-[11px] font-medium tracking-wide text-[#6F6D68]">
              Financial exposure
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tight text-[#292927]">
              {formatINR(totalExposure)}
            </div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#A87570]/10 border border-[#A87570]/20 text-[#A87570] text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ 8.4% vs previous assessment</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#6F6D68] leading-relaxed">
            Aggregate quantified enterprise liability across cyber incident vectors, DPDP statutory penalties, downtime disruptions, and remediation fees.
          </p>
        </div>

        {/* Right side: Sparkline & Model Confidence */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] self-stretch lg:self-auto min-w-[240px]">
          <div className="w-full">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6F6D68] mb-1.5">
              <span>90-Day Exposure Drift</span>
              <span className="text-[#292927] font-medium">Monte Carlo Sim</span>
            </div>
            {/* Clean SVG Trend Sparkline */}
            <svg className="w-full h-10 overflow-visible" viewBox="0 0 160 40">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A87570" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#A87570" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 32 Q 25 30 45 26 T 90 20 T 130 14 T 160 8 L 160 40 L 0 40 Z"
                fill="url(#sparklineGrad)"
              />
              <path
                d="M 0 32 Q 25 30 45 26 T 90 20 T 130 14 T 160 8"
                fill="none"
                stroke="#A87570"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="160" cy="8" r="3" fill="#A87570" />
            </svg>
          </div>

          <div className="w-full pt-2 border-t border-[#DCDAD4] flex items-center justify-between text-xs font-mono">
            <span className="text-[#6F6D68] text-[11px]">Model Confidence</span>
            <span className="text-[#718C78] font-medium">89% CI (p50)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Compact KPI Strip
export const KPIStrip: React.FC = () => {
  const { riskProfile, budget, optimizationResult } = useApp();

  const eal = riskProfile.expected_annual_loss;
  const portfolioRoi = optimizationResult.roi;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. EXPECTED LOSS */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm hover:border-[#D0CEC6] transition-colors group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-wide text-[#6F6D68]">
            Expected annual loss
          </span>
          <Calculator className="w-4 h-4 text-[#6F6D68] group-hover:text-[#292927] transition-colors" />
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-[#292927] tracking-tight">
            {formatINR(eal)}
          </div>
          <p className="text-[11px] font-mono text-[#6F6D68] mt-0.5">
            18.7% incident probability
          </p>
        </div>
      </div>

      {/* 2. MONITORED ASSETS */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm hover:border-[#D0CEC6] transition-colors group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-wide text-[#6F6D68]">
            Monitored assets
          </span>
          <ShieldCheck className="w-4 h-4 text-[#6F6275] transition-colors" />
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-[#292927] tracking-tight">
            12 Assets
          </div>
          <p className="text-[11px] font-mono text-[#6F6D68] mt-0.5">
            8 Mission-Critical systems
          </p>
        </div>
      </div>

      {/* 3. SECURITY BUDGET */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm hover:border-[#D0CEC6] transition-colors group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-wide text-[#6F6D68]">
            Security budget
          </span>
          <Wallet className="w-4 h-4 text-[#6F6D68] group-hover:text-[#292927] transition-colors" />
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-[#292927] tracking-tight">
            {formatINR(budget)}
          </div>
          <p className="text-[11px] font-mono text-[#6F6D68] mt-0.5">
            Constrained capital limit
          </p>
        </div>
      </div>

      {/* 4. OPTIMIZATION EFFICIENCY */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm hover:border-[#D0CEC6] transition-colors group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-wide text-[#6F6D68]">
            Optimization ROI
          </span>
          <Sparkles className="w-4 h-4 text-[#6F6275] transition-colors" />
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-bold font-mono text-[#6F6275] tracking-tight">
            {portfolioRoi.toFixed(2)}x
          </div>
          <p className="text-[11px] font-mono text-[#6F6D68] mt-0.5">
            0/1 Knapsack Portfolio ROI
          </p>
        </div>
      </div>
    </div>
  );
};

// Backwards-compatible export
export const KPICardsSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <PrimaryFinancialHero />
      <KPIStrip />
    </div>
  );
};
