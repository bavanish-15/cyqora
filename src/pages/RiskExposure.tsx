import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ThreatVector } from '../types';
import { formatINR, formatPercent, formatProbability } from '../utils/formatters';
import { ShieldAlert, ArrowUpDown, Filter, Search, ChevronRight, Info, AlertOctagon, TrendingUp, CheckCircle2 } from 'lucide-react';

export const RiskExposure: React.FC = () => {
  const { riskProfile } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'eal' | 'impact' | 'prob' | 'share'>('eal');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedThreat, setSelectedThreat] = useState<ThreatVector | null>(riskProfile.threats[0]);

  const filteredThreats = useMemo(() => {
    return riskProfile.threats
      .filter((t) => {
        const matchesSeverity = filterSeverity === 'ALL' || t.severity === filterSeverity;
        const matchesQuery = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             t.primary_vulnerability.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSeverity && matchesQuery;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortField === 'eal') {
          valA = a.expected_annual_loss;
          valB = b.expected_annual_loss;
        } else if (sortField === 'impact') {
          valA = a.financial_impact;
          valB = b.financial_impact;
        } else if (sortField === 'prob') {
          valA = a.probability;
          valB = b.probability;
        } else {
          valA = a.percentage_share;
          valB = b.percentage_share;
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [riskProfile.threats, filterSeverity, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: 'eal' | 'impact' | 'prob' | 'share') => {
    if (sortField === field) {
      setSortAsc(prev => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#A87570] text-xs font-medium tracking-wide mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Technical-to-financial risk decomposition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
            Enterprise Risk Exposure Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] mt-1">
            Granular translation of adversary vectors into actuarial loss probabilities and balance-sheet impact.
          </p>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs p-3 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4]">
          <div>
            <div className="text-[#6F6D68] text-[10px]">Aggregate exposure</div>
            <div className="text-[#292927] font-bold text-sm">{formatINR(riskProfile.total_exposure)}</div>
          </div>
          <div className="h-8 w-px bg-[#DCDAD4]" />
          <div>
            <div className="text-[#6F6D68] text-[10px]">Annualized loss</div>
            <div className="text-[#B49562] font-bold text-sm">{formatINR(riskProfile.expected_annual_loss)}</div>
          </div>
        </div>
      </div>

      {/* Top Threat Vector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskProfile.threats.slice(0, 3).map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedThreat(t)}
            className={`p-4 rounded-xl border transition-colors cursor-pointer ${
              selectedThreat?.id === t.id
                ? 'bg-[#F1F0EC] border-[#6F6275]'
                : 'bg-[#FFFFFF] border-[#DCDAD4] hover:border-[#D0CEC6]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#292927]">{t.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                t.severity === 'CRITICAL'
                  ? 'bg-[#A87570]/15 text-[#A87570] border border-[#A87570]/30'
                  : t.severity === 'HIGH'
                  ? 'bg-[#B49562]/15 text-[#B49562] border border-[#B49562]/30'
                  : 'bg-[#B49562]/15 text-[#B49562] border border-[#B49562]/30'
              }`}>
                {t.severity.charAt(0) + t.severity.slice(1).toLowerCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
              <div className="p-2 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px]">Impact</span>
                <div className="font-bold text-[#A87570] mt-0.5">{formatINR(t.financial_impact)}</div>
              </div>
              <div className="p-2 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
                <span className="text-[#6F6D68] text-[10px]">Annual Loss (EAL)</span>
                <div className="font-bold text-[#B49562] mt-0.5">{formatINR(t.expected_annual_loss)}</div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#DCDAD4] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#6F6D68]">P = {formatProbability(t.probability)}</span>
              <span className="text-[#6F6275] font-medium">{t.percentage_share}% Exposure</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6F6D68] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vector or vulnerability..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#292927] placeholder-[#6F6D68] focus:outline-none focus:border-[#6F6275] font-mono text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#6F6D68]" />
          <span className="text-[#6F6D68] text-[11px] font-medium">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-[#6F6275]/15 text-[#6F6275] border border-[#6F6275]/30'
                  : 'bg-[#F1F0EC] text-[#6F6D68] hover:text-[#292927] border border-[#DCDAD4]'
              }`}
            >
              {sev === 'ALL' ? 'All' : sev.charAt(0) + sev.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Granular Table */}
      <div className="rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DCDAD4] bg-[#F1F0EC] text-[#6F6D68] font-mono tracking-wide text-[10px]">
                <th className="py-3 px-4">Threat Vector</th>
                <th
                  onClick={() => toggleSort('prob')}
                  className="py-3 px-4 cursor-pointer hover:text-[#292927] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Probability</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('impact')}
                  className="py-3 px-4 cursor-pointer hover:text-[#292927] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Financial Impact</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('eal')}
                  className="py-3 px-4 cursor-pointer hover:text-[#292927] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Expected Annual Loss</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('share')}
                  className="py-3 px-4 cursor-pointer hover:text-[#292927] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Exposure Share</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Recommended Control</th>
                <th className="py-3 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDAD4]">
              {filteredThreats.map((t) => {
                const isSelected = selectedThreat?.id === t.id;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedThreat(t)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#6F6275]/10' : 'hover:bg-[#F1F0EC]/40'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#292927]">{t.name}</div>
                      <div className="text-[10px] text-[#6F6D68]">{t.primary_vulnerability}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#6F6275]">
                      {formatProbability(t.probability)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#A87570]">
                      {formatINR(t.financial_impact)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#B49562]">
                      {formatINR(t.expected_annual_loss)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6F6D68]">
                      {t.percentage_share}%
                    </td>
                    <td className="py-3 px-4 text-[#6F6D68]">
                      <span className="px-2 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[11px] font-mono">
                        {t.recommended_control}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        t.severity === 'CRITICAL' ? 'bg-[#A87570]/15 text-[#A87570] border border-[#A87570]/30' :
                        t.severity === 'HIGH' ? 'bg-[#B49562]/15 text-[#B49562] border border-[#B49562]/30' :
                        'bg-[#B49562]/15 text-[#B49562] border border-[#B49562]/30'
                      }`}>
                        {t.severity.charAt(0) + t.severity.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Threat Deep Dive Details */}
      {selectedThreat && (
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#6F6275]/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DCDAD4]">
            <h3 className="text-base font-bold text-[#292927] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#6F6275]" />
              {selectedThreat.name} Deep Quant Dossier
            </h3>
            <span className="text-xs text-[#6F6D68] font-mono">
              95% Confidence Interval ±12%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Financial Impact</span>
              <div className="text-lg font-bold text-[#A87570] mt-1">{formatINR(selectedThreat.financial_impact)}</div>
              <span className="text-[10px] text-[#6F6D68]">Gross balance sheet liability</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Expected Annual Loss</span>
              <div className="text-lg font-bold text-[#B49562] mt-1">{formatINR(selectedThreat.expected_annual_loss)}</div>
              <span className="text-[10px] text-[#6F6D68]">P(Incident) × Financial Impact</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Bayesian Likelihood</span>
              <div className="text-lg font-bold text-[#6F6275] mt-1">{formatProbability(selectedThreat.probability)}</div>
              <span className="text-[10px] text-[#6F6D68]">Confidence: {selectedThreat.confidence}%</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Share of Enterprise Risk</span>
              <div className="text-lg font-bold text-[#718C78] mt-1">{selectedThreat.percentage_share}%</div>
              <span className="text-[10px] text-[#6F6D68]">Relative risk weight</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
