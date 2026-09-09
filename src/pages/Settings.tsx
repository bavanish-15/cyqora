import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, CheckCircle2, RotateCcw, Shield, DollarSign, Database, Sliders } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, refreshRiskProfile } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDemo = () => {
    updateSettings({
      currency: 'INR',
      displayMode: 'CRORES',
      confidenceLevel: 95,
      regulatoryFramework: 'DPDP_2023',
      showConfidenceIntervals: true,
      autoRefresh: true,
    });
    refreshRiskProfile();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#6F6275] text-xs font-medium tracking-wide mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>Platform calibration & options</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292927] tracking-tight">
            Settings & Model Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D68] mt-1">
            Customize risk quantification formulas, Indian regulatory frameworks, and financial representation modes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetDemo}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#F1F0EC] hover:bg-[#E9E7E1] text-[#6F6D68] hover:text-[#292927] text-xs font-medium transition-colors border border-[#DCDAD4] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#6F6275] hover:bg-[#5A5160] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#718C78]/40 text-[#718C78] text-xs flex items-center space-x-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#718C78]" />
          <span className="font-semibold">Cyqora engine configuration updated successfully.</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Financial & Currency Formatting */}
        <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#DCDAD4]">
            <DollarSign className="w-5 h-5 text-[#6F6275]" />
            <h3 className="font-bold text-[#292927] text-base">Currency & Unit Representation</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[#6F6D68] block mb-1 font-mono font-medium">Display Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {['INR', 'USD', 'EUR'].map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => updateSettings({ currency: curr as any })}
                    className={`py-2 rounded-lg font-mono font-medium transition-colors border cursor-pointer ${
                      settings.currency === curr
                        ? 'bg-[#F1F0EC] border-[#6F6275] text-[#6F6275]'
                        : 'bg-[#F1F0EC] border-[#DCDAD4] text-[#6F6D68] hover:border-[#D0CEC6] hover:text-[#292927]'
                    }`}
                  >
                    {curr === 'INR' ? '₹ INR (Rupees)' : curr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#6F6D68] block mb-1 font-mono font-medium">Numeric Scale</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'CRORES', label: 'Indian Lakhs / Crores' },
                  { id: 'MILLIONS', label: 'Millions / Billions' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => updateSettings({ displayMode: mode.id as any })}
                    className={`py-2 rounded-lg font-mono font-medium transition-colors border cursor-pointer ${
                      settings.displayMode === mode.id
                        ? 'bg-[#F1F0EC] border-[#6F6275] text-[#6F6275]'
                        : 'bg-[#F1F0EC] border-[#DCDAD4] text-[#6F6D68] hover:border-[#D0CEC6] hover:text-[#292927]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Mathematical Confidence & Risk Modeling */}
        <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#DCDAD4]">
            <Sliders className="w-5 h-5 text-[#6F6275]" />
            <h3 className="font-bold text-[#292927] text-base">Mathematical Confidence Bounds</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[#6F6D68] block mb-1 font-mono font-medium">Confidence Interval Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[90, 95, 99].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateSettings({ confidenceLevel: lvl as any })}
                    className={`py-2 rounded-lg font-mono font-medium transition-colors border cursor-pointer ${
                      settings.confidenceLevel === lvl
                        ? 'bg-[#F1F0EC] border-[#6F6275] text-[#6F6275]'
                        : 'bg-[#F1F0EC] border-[#DCDAD4] text-[#6F6D68] hover:border-[#D0CEC6] hover:text-[#292927]'
                    }`}
                  >
                    {lvl}% CI
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#6F6D68] mt-1 font-mono">
                Calibrates bootstrap bounds around Expected Annual Loss estimates.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showConfidenceIntervals}
                  onChange={(e) => updateSettings({ showConfidenceIntervals: e.target.checked })}
                  className="rounded bg-[#F1F0EC] border-[#D0CEC6] text-[#6F6275] focus:ring-[#6F6275]"
                />
                <span className="text-[#6F6D68] font-medium">Display 95% Confidence Interval Ranges on KPI Cards</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Indian Compliance & Legal Frameworks */}
        <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#DCDAD4]">
            <Shield className="w-5 h-5 text-[#B49562]" />
            <h3 className="font-bold text-[#292927] text-base">Regulatory Penalty Multipliers</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { id: 'DPDP_2023', name: 'DPDP Act 2023', detail: 'Section 33 statutory penalties up to ₹250 Cr' },
              { id: 'RBI_CSF', name: 'RBI Cyber Security Framework', detail: 'Mandatory SOC MTTR SLAs for financial entities' },
              { id: 'SEBI_CSCCR', name: 'SEBI CSCCR Guideline', detail: 'Market infrastructure resilience provisions' },
            ].map((reg) => (
              <div
                key={reg.id}
                onClick={() => updateSettings({ regulatoryFramework: reg.id })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  settings.regulatoryFramework === reg.id
                    ? 'bg-[#F1F0EC] border-[#6F6275]'
                    : 'bg-[#F1F0EC] border-[#DCDAD4] hover:border-[#D0CEC6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#292927]">{reg.name}</span>
                  {settings.regulatoryFramework === reg.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#6F6275]" />
                  )}
                </div>
                <p className="text-[11px] text-[#6F6D68] mt-1 font-mono">{reg.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
