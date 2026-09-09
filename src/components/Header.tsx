import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  RefreshCw,
  Bell,
  ChevronDown,
  Check,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationDrawer } from './NotificationDrawer';
import { getPageTitle } from '../navigation/navConfig';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const location = useLocation();
  const {
    toggleSidebar,
    refreshRiskProfile,
    isEngineBusy,
    notifications,
  } = useApp();

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState('Demo Enterprise');
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);

  const environments = [
    'Demo Enterprise',
    'Fintech Prod Cluster',
    'Healthcare Region 1',
    'Global Corp',
  ];

  const pageTitle = getPageTitle(location.pathname);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 w-full border-b border-[rgba(41,41,39,0.08)] bg-[#FFFFFF]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            aria-label="Open navigation"
            className="md:hidden p-2 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {/* Mobile brand */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6F6275] flex items-center justify-center">
              <span className="text-[12px] font-semibold text-[#FFFFFF]">C</span>
            </div>
            <span className="font-semibold text-[14px] text-[#292927] tracking-[-0.02em]">
              Cyqora
            </span>
          </div>

          {/* Desktop page context */}
          <div className="hidden md:flex items-center gap-2 min-w-0">
            <span className="text-[17px] text-[#292927] tracking-[-0.02em] truncate">
              {pageTitle}
            </span>
          </div>
        </div>

        {/* Command search */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F6F2] hover:bg-[#F1F0EC] text-[12px] text-[#6F6D68] hover:text-[#6F6D68] transition-colors cursor-pointer w-56 lg:w-72 justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#6F6D68]" strokeWidth={1.75} />
              <span className="truncate">Search…</span>
            </div>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#FFFFFF] text-[#6F6D68] border border-[rgba(41,41,39,0.08)]">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Environment */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setShowEnvDropdown(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#718C78]" />
              <span>{selectedEnv}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6F6D68]" strokeWidth={1.75} />
            </button>

            {showEnvDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowEnvDropdown(false)}
                  aria-hidden
                />
                <div className="absolute right-0 mt-1.5 w-52 rounded-lg bg-[#FFFFFF] border border-[rgba(41,41,39,0.1)] shadow-lg py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] tracking-[0.06em] font-semibold text-[#6F6D68]">
                    Environment
                  </div>
                  {environments.map(env => (
                    <button
                      key={env}
                      onClick={() => {
                        setSelectedEnv(env);
                        setShowEnvDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer ${
                        selectedEnv === env
                          ? 'text-[#5A5160] font-medium'
                          : 'text-[#6F6D68]'
                      }`}
                    >
                      <span>{env}</span>
                      {selectedEnv === env && (
                        <Check className="w-3.5 h-3.5 text-[#6F6275]" strokeWidth={2} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[#718C78]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#718C78]" />
            <span>Operational</span>
          </div>

          <button
            onClick={refreshRiskProfile}
            disabled={isEngineBusy}
            title="Refresh risk profile"
            className="p-2 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${isEngineBusy ? 'animate-spin text-[#6F6275]' : ''}`}
              strokeWidth={1.75}
            />
          </button>

          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            aria-label="Open notifications"
            className="relative p-2 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" strokeWidth={1.75} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#A87570] text-[9px] font-semibold text-white flex items-center justify-center font-mono">
                {notifications.length}
              </span>
            )}
          </button>

          <div className="flex items-center pl-2 ml-0.5 border-l border-[rgba(41,41,39,0.08)]">
            <div
              title="Chief Information Security Officer"
              className="w-8 h-8 rounded-full bg-[#F1F0EC] flex items-center justify-center text-[11px] font-semibold text-[#5A5160] cursor-default tracking-wide"
            >
              CI
            </div>
          </div>
        </div>
      </header>

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </>
  );
};
