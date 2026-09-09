import React from 'react';
import { useApp } from '../context/AppContext';
import { PrimaryFinancialHero, KPIStrip } from '../components/KPICard';
import { RiskToInvestmentFlow } from '../components/RiskToInvestmentFlow';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { RiskBarChart } from '../components/RiskBarChart';
import { RiskDonut } from '../components/RiskDonut';
import { BeforeAfterComparison } from '../components/BeforeAfterComparison';
import { InsightCard } from '../components/InsightCard';
import { ShieldAlert, ArrowRight, Zap, Target, Sliders, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/formatters';

export const ExecutiveCockpit: React.FC = () => {
  const { riskProfile, simResult, budget, optimizationResult } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Identity Banner */}
      <div className="p-6 sm:p-7 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#6F6275]" />
              <span className="text-[11px] font-medium tracking-wide text-[#6F6275]">
                Executive risk intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
              Cyber risk overview
            </h1>
            <p className="text-xs sm:text-sm text-[#6F6D68] leading-relaxed">
              Translate cyber exposure into financial liability and optimize defensive investment.
            </p>
          </div>

          {/* Right: Risk Posture Indicator */}
          <div className="p-4 rounded-lg bg-[#F1F0EC] border border-[#A87570]/30 self-start md:self-auto min-w-[220px]">
            <span className="text-[10px] font-medium tracking-wide text-[#6F6D68]">
              Enterprise risk posture
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#A87570]" />
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#A87570] tracking-wide">
                Critical · 72 / 100
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#A87570] mt-0.5 block font-medium">
              ● High Unmitigated Exposure
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Financial Hero */}
      <PrimaryFinancialHero />

      {/* 3. Compact KPI Strip */}
      <KPIStrip />

      {/* 4. Signature CYQORA Pipeline: How Technical Risk Becomes Financial Exposure */}
      <RiskToInvestmentFlow />

      {/* 5. Main Quantitative Visualizations: Risk Heatmap & Financial Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RiskHeatmap threats={riskProfile.threats} />
        </div>
        <div className="lg:col-span-5">
          <RiskDonut threats={riskProfile.threats} totalExposure={riskProfile.total_exposure} />
        </div>
      </div>

      {/* 6. Comprehensive Threat Impact vs Expected Annual Loss Chart */}
      <RiskBarChart threats={riskProfile.threats} />

      {/* 7. Before vs. After Optimization State Comparison */}
      <BeforeAfterComparison />

      {/* 8. AI Decision Brief with Actuarial Explainability */}
      <InsightCard />

      {/* 9. Quick Action Pathways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/investment"
          className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm hover:border-[#6F6275]/50 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6275] group-hover:text-[#71859A] transition-colors">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-sm text-[#292927] group-hover:text-[#6F6275] transition-colors">
                Run 0/1 Knapsack Optimizer
              </div>
              <p className="text-[11px] text-[#6F6D68]">
                Allocate ₹1.00 Cr budget to maximize portfolio ROI
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6F6D68] group-hover:text-[#6F6275] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/simulator"
          className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm hover:border-[#6F6275]/50 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6275] group-hover:text-[#71859A] transition-colors">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-sm text-[#292927] group-hover:text-[#6F6275] transition-colors">
                What-If Sensitivity Simulator
              </div>
              <p className="text-[11px] text-[#6F6D68]">
                Simulate defensive coverage sliders in real-time
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6F6D68] group-hover:text-[#6F6275] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/reports"
          className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm hover:border-[#6F6275]/50 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6275] group-hover:text-[#71859A] transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-sm text-[#292927] group-hover:text-[#6F6275] transition-colors">
                Board Risk Dossier
              </div>
              <p className="text-[11px] text-[#6F6D68]">
                Export actuarial audit report & executive summary
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6F6D68] group-hover:text-[#6F6275] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
};
