import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AIChatBot } from './AIChatBot';
import { CommandPalette } from './CommandPalette';
import { useApp } from '../context/AppContext';

/**
 * Global application shell: header, collapsible sidebar, main outlet, footer.
 * Page content is rendered via <Outlet /> — do not redesign pages here.
 */
export const AppShell: React.FC = () => {
  const { isSidebarCollapsed } = useApp();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-shell min-h-screen flex flex-col antialiased selection:bg-[rgba(111,98,117,0.15)] selection:text-[#292927]">
      <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      <div className="flex-1 flex relative">
        <Sidebar />

        <div
          className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out ${
            isSidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-[240px]'
          }`}
        >
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>

          <footer className="w-full border-t border-[rgba(41,41,39,0.08)] bg-[#FFFFFF] py-4 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6F6D68]">
              <div className="flex items-center gap-2 tracking-wide">
                <span className="font-semibold text-[#292927]">Cyqora</span>
                <span className="text-[rgba(41,41,39,0.25)]">·</span>
                <span>Financial risk intelligence</span>
              </div>
              <div className="text-[#6F6D68]">
                Quantitative estimates · Decision support
              </div>
            </div>
          </footer>
        </div>
      </div>

      <AIChatBot />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

/** @deprecated Prefer AppShell — kept for any legacy imports */
export const DashboardLayout = AppShell;
