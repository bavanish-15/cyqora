import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  LayoutDashboard,
  TrendingDown,
  Crosshair,
  Briefcase,
  GitBranch,
  BrainCircuit,
  Building2,
  FileText,
  Settings,
  Sparkles,
  ArrowRight,
  Zap,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  category: 'NAVIGATION' | 'SCENARIOS' | 'ACTIONS';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setSimParams, refreshRiskProfile } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allItems: PaletteItem[] = [
    {
      id: 'nav-exec',
      category: 'NAVIGATION',
      title: 'Overview',
      subtitle: 'Executive financial exposure and risk summary',
      icon: LayoutDashboard,
      action: () => { navigate('/executive'); onClose(); },
    },
    {
      id: 'nav-risk',
      category: 'NAVIGATION',
      title: 'Risk',
      subtitle: 'Threat breakdown and actuarial probabilities',
      icon: TrendingDown,
      action: () => { navigate('/risk-exposure'); onClose(); },
    },
    {
      id: 'nav-exposure',
      category: 'NAVIGATION',
      title: 'Exposure',
      subtitle: 'Intelligence feeds and attack-path context',
      icon: Crosshair,
      action: () => { navigate('/threat-intelligence'); onClose(); },
    },
    {
      id: 'nav-invest',
      category: 'NAVIGATION',
      title: 'Investments',
      subtitle: 'Capital allocation and portfolio optimization',
      icon: Briefcase,
      action: () => { navigate('/investment'); onClose(); },
    },
    {
      id: 'nav-sim',
      category: 'NAVIGATION',
      title: 'Scenarios',
      subtitle: 'What-if sensitivity and forecasting',
      icon: GitBranch,
      action: () => { navigate('/simulator'); onClose(); },
    },
    {
      id: 'nav-assets',
      category: 'NAVIGATION',
      title: 'Assets',
      subtitle: 'Enterprise asset inventory',
      icon: Building2,
      action: () => { navigate('/assets'); onClose(); },
    },
    {
      id: 'nav-reports',
      category: 'NAVIGATION',
      title: 'Reports',
      subtitle: 'Board and executive reporting',
      icon: FileText,
      action: () => { navigate('/reports'); onClose(); },
    },
    {
      id: 'nav-models',
      category: 'NAVIGATION',
      title: 'Models',
      subtitle: 'Quantitative model documentation',
      icon: BrainCircuit,
      action: () => { navigate('/ai-models'); onClose(); },
    },
    {
      id: 'nav-settings',
      category: 'NAVIGATION',
      title: 'Settings',
      subtitle: 'Preferences and calibrations',
      icon: Settings,
      action: () => { navigate('/settings'); onClose(); },
    },
    {
      id: 'scen-mfa',
      category: 'SCENARIOS',
      title: 'Ransomware fortress preset',
      subtitle: 'MFA 100% · EDR 95% · Backups 98%',
      icon: Sparkles,
      badge: 'Preset',
      action: () => {
        setSimParams({
          mfa_coverage: 100,
          edr_coverage: 95,
          segmentation: 60,
          backup_resilience: 98,
          soc_monitoring: 80,
        });
        navigate('/simulator');
        onClose();
      },
    },
    {
      id: 'scen-zt',
      category: 'SCENARIOS',
      title: 'Zero trust complete preset',
      subtitle: 'Segmentation 95% · MFA 100%',
      icon: Sparkles,
      badge: 'Preset',
      action: () => {
        setSimParams({
          mfa_coverage: 100,
          edr_coverage: 92,
          segmentation: 95,
          backup_resilience: 85,
          soc_monitoring: 90,
        });
        navigate('/simulator');
        onClose();
      },
    },
    {
      id: 'scen-soc',
      category: 'SCENARIOS',
      title: 'Managed monitoring preset',
      subtitle: 'SOC 100% · EDR 88%',
      icon: Zap,
      badge: 'Preset',
      action: () => {
        setSimParams({
          mfa_coverage: 80,
          edr_coverage: 88,
          segmentation: 50,
          backup_resilience: 70,
          soc_monitoring: 100,
        });
        navigate('/simulator');
        onClose();
      },
    },
    {
      id: 'act-refresh',
      category: 'ACTIONS',
      title: 'Refresh risk profile',
      subtitle: 'Recalculate current risk estimates',
      icon: Sparkles,
      action: () => {
        refreshRiskProfile();
        onClose();
      },
    },
  ];

  const filteredItems = allItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length)
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredItems[selectedIndex]?.action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[rgba(41,41,39,0.4)] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-[#FFFFFF] border border-[rgba(41,41,39,0.1)] shadow-xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[rgba(41,41,39,0.08)]">
          <Search className="w-4 h-4 text-[#6F6D68] mr-3 flex-shrink-0" strokeWidth={1.75} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, scenarios, actions…"
            className="w-full bg-transparent text-[13px] text-[#292927] placeholder-[#6F6D68] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#6F6D68] text-[12px]">No matches.</div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[rgba(111,98,117,0.1)] text-[#292927]'
                      : 'hover:bg-[rgba(41,41,39,0.04)] text-[#6F6D68]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate min-w-0">
                    <div
                      className={`p-1.5 rounded-md flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#6F6275] text-[#FFFFFF]'
                          : 'bg-[#F7F6F2] text-[#6F6D68]'
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#292927]">{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wide text-[#6F6D68] bg-[#F7F6F2]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6F6D68] truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[10px] tracking-[0.06em] text-[#6F6D68] hidden sm:inline">
                      {item.category === 'NAVIGATION'
                        ? 'Navigation'
                        : item.category === 'SCENARIOS'
                        ? 'Scenarios'
                        : 'Actions'}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-[#6F6275]' : 'text-[#A8A69F]'}`}
                      strokeWidth={1.75}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-[rgba(41,41,39,0.08)] flex items-center justify-between text-[11px] text-[#6F6D68]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#F7F6F2] text-[10px] border border-[rgba(41,41,39,0.08)]">↑↓</kbd>{' '}
              navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#F7F6F2] text-[10px] border border-[rgba(41,41,39,0.08)]">↵</kbd>{' '}
              select
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#F7F6F2] text-[10px] border border-[rgba(41,41,39,0.08)]">esc</kbd>{' '}
              close
            </span>
          </div>
          <span className="text-[#6F6275] font-medium">Cyqora</span>
        </div>
      </div>
    </div>
  );
};
