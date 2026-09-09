import React, { useState } from 'react';
import { ChevronRight, Sparkles, Check, HelpCircle } from 'lucide-react';

export const StoryFlowBanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    { num: 1, title: 'Assets & Threats', desc: 'Catalog critical systems & external adversary vectors' },
    { num: 2, title: 'Causal Probability', desc: 'Bayesian DAG probability propagation through attack chains' },
    { num: 3, title: 'Financial Impact', desc: 'Multi-component liability analysis (Downtime, DPDP, Ransom)' },
    { num: 4, title: 'Expected Annual Loss', desc: 'EAL = P(Incident) × Financial Impact in Indian Rupees' },
    { num: 5, title: 'Exposure Allocation', desc: 'Identify Ransomware & Breach as 70% primary exposures' },
    { num: 6, title: 'Evaluate Controls', desc: 'Measure marginal risk reduction and unit deployment costs' },
    { num: 7, title: 'Knapsack Optimization', desc: 'Maximize risk reduction subject to budget constraints' },
    { num: 8, title: 'Purchase Decision', desc: 'Exact optimal security procurement portfolio' },
    { num: 9, title: 'What-If Simulation', desc: 'Instant sensitivity stress-testing before committing capital' },
  ];

  return (
    <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 mb-2.5 border-b border-[#DCDAD4] gap-1.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#6F6275]" />
          <span className="font-bold text-[#292927] tracking-wide text-[11px]">
            Cyqora methodology pipeline
          </span>
        </div>
        <span className="text-[11px] text-[#6F6D68] font-mono">
          From Risk Score &rarr; To Rupees &rarr; To Right Investment
        </span>
      </div>

      {/* Horizontal step flow */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 overflow-x-auto pb-1">
        {steps.map((s, idx) => {
          const isSelected = activeStep === idx;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(isSelected ? null : idx)}
              className={`p-1.5 rounded-lg text-left transition-colors relative border flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#6F6275]/15 border-[#6F6275]/50 text-[#292927]'
                  : 'bg-[#F1F0EC] border-[#DCDAD4] hover:bg-[#E9E7E1] text-[#6F6D68]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold font-mono ${
                  isSelected ? 'bg-[#6F6275] text-white' : 'bg-[#F7F6F2] text-[#6F6D68]'
                }`}>
                  {s.num}
                </span>
                {idx < steps.length - 1 && (
                  <span className="hidden md:inline text-[#6F6D68] text-[9px]">&rarr;</span>
                )}
              </div>
              <div className="font-medium text-[10px] mt-1 leading-tight truncate w-full text-[#292927]">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail drawer if step clicked */}
      {activeStep !== null && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-[#F7F6F2] border border-[#DCDAD4] text-xs flex items-center justify-between text-[#6F6D68]">
          <div>
            <span className="font-bold text-[#6F6275] mr-2 font-mono">
              Step {steps[activeStep].num}: {steps[activeStep].title}
            </span>
            <span className="text-[#6F6D68]">{steps[activeStep].desc}</span>
          </div>
          <button
            onClick={() => setActiveStep(null)}
            className="text-[10px] text-[#6F6D68] hover:text-[#292927] font-mono ml-2 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
