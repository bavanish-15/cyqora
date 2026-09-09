import React, { useEffect, useState } from 'react';
import { ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface StartupSplashProps {
  onComplete: () => void;
}

export const StartupSplash: React.FC<StartupSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [stageText, setStageText] = useState('Initializing Bayesian Risk Engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStageText('Translating CVSS Telemetry to Financial Exposure...');
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(88);
      setStageText('Calibrating 0/1 Knapsack Investment Optimizer...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStageText('Ready. Entering cyber risk overview.');
    }, 1250);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F6F2] text-[#292927]">
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* Logo Badge */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-xl bg-[#F1F0EC] border border-[#DCDAD4] flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-8 h-8 text-[#6F6275]" />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 rounded-md bg-[#F7F6F2] border border-[#DCDAD4]">
            <Cpu className="w-3.5 h-3.5 text-[#718C78]" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[#292927]">
            Cyqora
          </h1>
          <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded bg-[#F1F0EC] border border-[#DCDAD4] text-[#6F6275]">
            AI models
          </span>
        </div>

        <p className="text-xs tracking-wide text-[#6F6D68] font-mono mt-1">
          Cyber risk quantification
        </p>

        <p className="text-sm font-mono text-[#6F6D68] mt-4 h-6 transition-all duration-300">
          "{stageText}"
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full bg-[#F1F0EC] h-1.5 rounded-full mt-6 overflow-hidden border border-[#DCDAD4]">
          <div
            className="bg-[#6F6275] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex justify-between items-center text-[11px] text-[#6F6D68] font-mono mt-2">
          <span>Enterprise Financial Intelligence</span>
          <span>{progress}%</span>
        </div>

        <button
          onClick={onComplete}
          className="mt-8 text-xs text-[#6F6D68] hover:text-[#292927] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-[#6F6275]" /> Skip to overview
        </button>
      </div>
    </div>
  );
};
