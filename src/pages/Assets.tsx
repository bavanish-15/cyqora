import React, { useState, useMemo } from 'react';
import { ENTERPRISE_ASSETS_DATA } from '../data/demoData';
import { EnterpriseAsset } from '../types';
import { formatINR } from '../utils/formatters';
import { Server, ShieldCheck, AlertCircle, Plus, Search, Filter, Database, CheckCircle2, X } from 'lucide-react';

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<EnterpriseAsset[]>(ENTERPRISE_ASSETS_DATA);
  const [selectedAsset, setSelectedAsset] = useState<EnterpriseAsset | null>(assets[0]);
  const [filterCriticality, setFilterCriticality] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Asset Form State
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetUnit, setNewAssetUnit] = useState('Digital Infrastructure');
  const [newAssetTier, setNewAssetTier] = useState('TIER 1 - MISSION CRITICAL');
  const [newRevenueDep, setNewRevenueDep] = useState('150000000');
  const [newFinancialExposure, setNewFinancialExposure] = useState('6500000');

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchesTier = filterCriticality === 'ALL' || a.criticality.includes(filterCriticality);
      const matchesQuery = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           a.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           a.threat_exposure.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesQuery;
    });
  }, [assets, filterCriticality, searchQuery]);

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName) return;

    const newAsset: EnterpriseAsset = {
      id: `ast-${Date.now()}`,
      name: newAssetName,
      unit: newAssetUnit,
      criticality: newAssetTier,
      revenue_dependency: Number(newRevenueDep) || 100000000,
      threat_exposure: 'Ransomware, Account Hijack',
      control_score: 75,
      financial_exposure: Number(newFinancialExposure) || 5000000,
      status: 'PROTECTED',
      compliance: 'DPDP Act 2023, ISO 27001',
    };

    setAssets([newAsset, ...assets]);
    setSelectedAsset(newAsset);
    setIsAddModalOpen(false);
    setNewAssetName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#6F6275] text-xs font-medium tracking-wide mb-1">
            <Server className="w-4 h-4" />
            <span>Crown jewel & critical infrastructure catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
            Enterprise Asset Inventory & Criticality
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] mt-1">
            Inventory of 12 evaluated business systems with mapped revenue dependency and DPDP Act 2023 compliance status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#6F6275] hover:bg-[#5A5160] text-white text-xs font-medium transition-colors self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6F6D68] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search asset, business unit, threat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#292927] placeholder-[#6F6D68] focus:outline-none focus:border-[#6F6275]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#6F6D68]" />
          <span className="text-[#6F6D68] text-[11px] font-medium">Criticality:</span>
          {['ALL', 'TIER 1', 'TIER 2', 'TIER 3'].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterCriticality(tier)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterCriticality === tier
                  ? 'bg-[#F1F0EC] text-[#6F6275] border border-[#6F6275]'
                  : 'bg-[#F1F0EC] text-[#6F6D68] hover:text-[#292927] border border-[#DCDAD4]'
              }`}
            >
              {tier === 'ALL' ? 'All' : tier.charAt(0) + tier.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DCDAD4] bg-[#F1F0EC] text-[#6F6D68] font-mono font-medium tracking-wide text-[10px]">
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Criticality</th>
                <th className="py-3 px-4">Revenue Dependency</th>
                <th className="py-3 px-4">Financial Exposure</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Compliance Framework</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDAD4]">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F1F0EC]' : 'hover:bg-[#F1F0EC]/50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#292927]">{asset.name}</div>
                      <div className="text-[10px] text-[#6F6D68] font-mono">{asset.unit}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        asset.criticality.includes('TIER 1') ? 'bg-[#F1F0EC] text-[#A87570] border border-[#A87570]/30' :
                        asset.criticality.includes('TIER 2') ? 'bg-[#F1F0EC] text-[#B49562] border border-[#B49562]/30' :
                        'bg-[#F1F0EC] text-[#6F6D68] border border-[#DCDAD4]'
                      }`}>
                        {asset.criticality.split(' - ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#292927]">
                      {formatINR(asset.revenue_dependency)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#A87570]">
                      {formatINR(asset.financial_exposure)}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded font-mono font-medium text-xs bg-[#F1F0EC] border border-[#DCDAD4] ${
                        asset.control_score >= 75 ? 'text-[#718C78]' :
                        asset.control_score >= 60 ? 'text-[#B49562]' :
                        'text-[#A87570]'
                      }`}>
                        {asset.control_score}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        asset.status === 'PROTECTED' ? 'bg-[#F1F0EC] text-[#718C78] border border-[#718C78]/30' :
                        asset.status === 'AT RISK' ? 'bg-[#F1F0EC] text-[#A87570] border border-[#A87570]/30' :
                        'bg-[#F1F0EC] text-[#6F6D68] border border-[#DCDAD4]'
                      }`}>
                        {asset.status
                          .split(' ')
                          .map(w => w.charAt(0) + w.slice(1).toLowerCase())
                          .join(' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6F6D68]">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6D68] font-mono">
                        {asset.compliance.split(',')[0]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Asset Detailed View */}
      {selectedAsset && (
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#6F6275]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCDAD4] gap-2">
            <div>
              <span className="text-[10px] font-medium text-[#6F6275] tracking-wide">
                Asset telemetry & financial profile
              </span>
              <h3 className="text-base font-bold text-[#292927] mt-0.5">
                {selectedAsset.name} ({selectedAsset.criticality})
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-[#6F6D68]">Threat Exposure:</span>
              <span className="px-2 py-0.5 rounded bg-[#F1F0EC] text-[#6F6275] border border-[#DCDAD4] font-medium">
                {selectedAsset.threat_exposure}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Revenue dependency</span>
              <div className="text-lg font-bold text-[#292927] mt-1">{formatINR(selectedAsset.revenue_dependency)}</div>
              <span className="text-[10px] text-[#6F6D68]">Supported business throughput</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Financial cyber exposure</span>
              <div className="text-lg font-bold text-[#A87570] mt-1">{formatINR(selectedAsset.financial_exposure)}</div>
              <span className="text-[10px] text-[#6F6D68]">Unhedged downside liability</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4]">
              <span className="text-[#6F6D68] text-[10px]">Compliance mandates</span>
              <div className="text-xs font-semibold text-[#718C78] mt-1 truncate">{selectedAsset.compliance}</div>
              <span className="text-[10px] text-[#6F6D68]">Audited control baseline</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F6F2]/80 backdrop-blur-sm p-4">
          <div className="bg-[#FFFFFF] border border-[#DCDAD4] rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCDAD4]">
              <h3 className="font-bold text-[#292927] text-base">Register Enterprise Asset</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#6F6D68] hover:text-[#292927] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="text-[#6F6D68] block mb-1 font-mono">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time UPI Switch"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#292927] focus:outline-none focus:border-[#6F6275]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#6F6D68] block mb-1 font-mono">Business Unit</label>
                  <input
                    type="text"
                    value={newAssetUnit}
                    onChange={(e) => setNewAssetUnit(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#292927] focus:outline-none focus:border-[#6F6275]"
                  />
                </div>

                <div>
                  <label className="text-[#6F6D68] block mb-1 font-mono">Criticality</label>
                  <select
                    value={newAssetTier}
                    onChange={(e) => setNewAssetTier(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#292927] focus:outline-none focus:border-[#6F6275]"
                  >
                    <option value="TIER 1 - MISSION CRITICAL">Tier 1 - Mission Critical</option>
                    <option value="TIER 2 - HIGH">Tier 2 - High Business</option>
                    <option value="TIER 3 - OPERATIONAL">Tier 3 - Operational</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#6F6D68] block mb-1 font-mono">Revenue Dependency (₹)</label>
                  <input
                    type="number"
                    value={newRevenueDep}
                    onChange={(e) => setNewRevenueDep(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#292927] focus:outline-none focus:border-[#6F6275]"
                  />
                </div>

                <div>
                  <label className="text-[#6F6D68] block mb-1 font-mono">Cyber Exposure (₹)</label>
                  <input
                    type="number"
                    value={newFinancialExposure}
                    onChange={(e) => setNewFinancialExposure(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#F1F0EC] border border-[#DCDAD4] text-[#292927] focus:outline-none focus:border-[#6F6275]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#DCDAD4]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#F1F0EC] hover:bg-[#E9E7E1] text-[#6F6D68] hover:text-[#292927] font-mono font-medium border border-[#DCDAD4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#6F6275] hover:bg-[#5A5160] text-white font-semibold cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
