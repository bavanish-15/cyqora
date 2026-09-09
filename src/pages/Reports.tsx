import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatProbability } from '../utils/formatters';
import { FileBarChart, Download, Printer, Share2, CheckCircle2, Shield, Calendar, Building } from 'lucide-react';

export const Reports: React.FC = () => {
  const { riskProfile, optimizationResult, budget } = useApp();
  const [selectedReportType, setSelectedReportType] = useState<'board' | 'technical' | 'dpdp' | 'insurance'>('board');
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      title: 'CYQORA Cyber Risk Quantification & Investment Dossier',
      timestamp: new Date().toISOString(),
      report_type: selectedReportType,
      financial_metrics: {
        total_exposure_inr: riskProfile.total_exposure,
        expected_annual_loss_inr: riskProfile.expected_annual_loss,
        allocated_budget_inr: budget,
        optimized_investment_inr: optimizationResult.total_cost,
        risk_reduction_inr: optimizationResult.total_risk_reduction,
        portfolio_roi: optimizationResult.roi,
      },
      funded_controls: optimizationResult.selected_controls.map(c => ({
        name: c.name,
        cost_inr: c.cost,
        risk_reduction_inr: c.risk_reduction,
        roi: c.roi,
      })),
      evaluated_threats: riskProfile.threats.map(t => ({
        vector: t.name,
        probability: t.probability,
        impact_inr: t.financial_impact,
        eal_inr: t.expected_annual_loss,
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CYQORA_${selectedReportType.toUpperCase()}_REPORT.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#6F6275] text-xs font-medium tracking-wide mb-1">
            <FileBarChart className="w-4 h-4" />
            <span>Board-ready financial attestations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
            Executive Risk & Investment Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] mt-1">
            Publish mathematically auditable cybersecurity risk disclosures for the Board of Directors, CFOs, and insurers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#F1F0EC] hover:bg-[#E9E7E1] text-[#6F6D68] hover:text-[#292927] text-xs font-medium transition-colors border border-[#DCDAD4] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#6F6275] hover:bg-[#5A5160] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'board', title: 'Executive Board Report', desc: 'Financial exposure & ROI allocation' },
          { id: 'technical', title: 'Technical Audit Dossier', desc: 'Vulnerability telemetry & Bayesian propagation' },
          { id: 'dpdp', title: 'DPDP Act 2023 Compliance', desc: 'Data protection penalty liability analysis' },
          { id: 'insurance', title: 'Cyber Insurance Placement', desc: 'Residual risk & underwriting baseline' },
        ].map((rep) => {
          const isSelected = selectedReportType === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReportType(rep.id as any)}
              className={`p-4 rounded-xl text-left border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#F1F0EC] border-[#6F6275]'
                  : 'bg-[#FFFFFF] border-[#DCDAD4] hover:border-[#D0CEC6] text-[#6F6D68]'
              }`}
            >
              <div className="font-semibold text-xs text-[#292927]">{rep.title}</div>
              <div className="text-[11px] text-[#6F6D68] mt-1 font-mono">{rep.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Printable / Rendered Report Preview Paper */}
      <div className="p-8 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-6 max-w-4xl mx-auto font-sans text-[#292927]">
        {/* Report Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCDAD4] gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] flex items-center justify-center text-[#6F6275] font-mono font-bold">
              CQ
            </div>
            <div>
              <div className="font-bold text-lg text-[#292927] tracking-wide">
                Cyqora quantitative cyber attestation
              </div>
              <div className="text-xs text-[#6F6D68] font-mono flex items-center gap-2">
                <span>Enterprise: Demo Corp</span>
                <span>•</span>
                <span>Classification: Restricted</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#6F6D68] font-mono text-left sm:text-right">
            <div>Audit Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
            <div className="text-[#6F6275] font-medium">Standard: FAIR & ISO 27005 Aligned</div>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="space-y-3 text-xs leading-relaxed text-[#6F6D68]">
          <h3 className="text-sm font-semibold text-[#292927] font-mono tracking-wide">
            1. Executive assessment summary
          </h3>
          <p>
            This quantitative evaluation evaluates total enterprise liability across <span className="text-[#292927] font-semibold">{riskProfile.protected_assets} critical systems</span>.
            The current unmitigated cyber exposure stands at <span className="text-[#A87570] font-bold font-mono">{formatINR(riskProfile.total_exposure)}</span> with an Expected Annual Loss (EAL) of <span className="text-[#B49562] font-bold font-mono">{formatINR(riskProfile.expected_annual_loss)}</span>.
          </p>
          <p>
            Under the approved cybersecurity capital pool of <span className="text-[#6F6275] font-bold font-mono">{formatINR(budget)}</span>, the 0/1 Knapsack optimization algorithm selected <span className="text-[#292927] font-semibold">{optimizationResult.selected_controls.length} high-leverage defensive controls</span>, preventing <span className="text-[#718C78] font-bold font-mono">{formatINR(optimizationResult.total_risk_reduction)}</span> in losses at an aggregate portfolio ROI of <span className="text-[#B49562] font-bold font-mono">{optimizationResult.roi}×</span>.
          </p>
        </div>

        {/* Key Metrics Grid in Report */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#6F6D68]">Gross risk exposure</span>
            <div className="text-base font-bold text-[#292927] mt-0.5">{formatINR(riskProfile.total_exposure)}</div>
          </div>
          <div>
            <span className="text-[10px] text-[#6F6D68]">Expected annual loss</span>
            <div className="text-base font-bold text-[#B49562] mt-0.5">{formatINR(riskProfile.expected_annual_loss)}</div>
          </div>
          <div>
            <span className="text-[10px] text-[#6F6D68]">Deployed capital</span>
            <div className="text-base font-bold text-[#6F6275] mt-0.5">{formatINR(optimizationResult.total_cost)}</div>
          </div>
          <div>
            <span className="text-[10px] text-[#6F6D68]">Residual exposure</span>
            <div className="text-base font-bold text-[#718C78] mt-0.5">{formatINR(optimizationResult.residual_risk)}</div>
          </div>
        </div>

        {/* Selected Controls Investment Portfolio Table */}
        <div className="space-y-2 text-xs">
          <h3 className="text-sm font-semibold text-[#292927] font-mono tracking-wide">
            2. Approved defensive investment portfolio (0/1 knapsack allocation)
          </h3>
          <table className="w-full text-left border border-[#DCDAD4] text-xs">
            <thead className="bg-[#F1F0EC] text-[#6F6D68] font-mono text-[10px]">
              <tr>
                <th className="p-2 border-b border-[#DCDAD4]">Control Specification</th>
                <th className="p-2 border-b border-[#DCDAD4]">Capital Cost</th>
                <th className="p-2 border-b border-[#DCDAD4]">Risk Reduction</th>
                <th className="p-2 border-b border-[#DCDAD4]">Portfolio ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDAD4] font-mono text-[11px]">
              {optimizationResult.selected_controls.map(c => (
                <tr key={c.id}>
                  <td className="p-2 font-sans font-medium text-[#292927]">{c.name}</td>
                  <td className="p-2 text-[#6F6D68]">{formatINR(c.cost)}</td>
                  <td className="p-2 text-[#718C78] font-medium">{formatINR(c.risk_reduction)}</td>
                  <td className="p-2 text-[#B49562] font-medium">{c.roi}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures & Disclosures */}
        <div className="pt-6 border-t border-[#DCDAD4] grid grid-cols-2 gap-6 text-xs">
          <div>
            <div className="text-[10px] font-semibold text-[#6F6D68] font-mono">Prepared by</div>
            <div className="font-semibold text-[#292927] mt-1">Cyqora quantitative risk engine v1.0</div>
            <div className="text-[#6F6D68] text-[10px] font-mono">Deterministic Bayesian & DP Knapsack Modules</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[#6F6D68] font-mono">Board authorization</div>
            <div className="h-6 border-b border-dashed border-[#D0CEC6] mt-1" />
            <div className="text-[#6F6D68] text-[10px] font-mono mt-1">Chief Risk Officer / Chief Financial Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
