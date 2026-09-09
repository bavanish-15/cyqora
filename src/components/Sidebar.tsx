import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRIMARY_NAV, SECONDARY_NAV } from '../navigation/navConfig';

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    setSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
  } = useApp();

  const renderNavItem = (item: (typeof PRIMARY_NAV)[number]) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => setSidebarOpen(false)}
        title={isSidebarCollapsed ? item.label : undefined}
        className={({ isActive }) =>
          `group flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
            isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
          } ${
            isActive
              ? 'bg-[rgba(111,98,117,0.1)] text-[#5A5160]'
              : 'text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                isActive ? 'text-[#6F6275]' : 'text-[#6F6D68] group-hover:text-[#6F6D68]'
              }`}
              strokeWidth={1.75}
            />
            {!isSidebarCollapsed && (
              <span className="truncate tracking-[-0.01em]">{item.label}</span>
            )}
            {!isSidebarCollapsed && isActive && (
              <span className="ml-auto w-1 h-1 rounded-full bg-[#6F6275]" aria-hidden />
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[rgba(41,41,39,0.35)] transition-opacity duration-300 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#FFFFFF] border-r border-[rgba(41,41,39,0.08)] transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isSidebarCollapsed ? 'md:w-[72px]' : 'md:w-[240px]'}
          w-72 shadow-lg md:shadow-none
        `}
      >
        {/* Brand */}
        <div className="h-16 px-4 border-b border-[rgba(41,41,39,0.08)] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <div className="w-8 h-8 rounded-md bg-[#6F6275] flex items-center justify-center flex-shrink-0">
              <span className="text-[13px] font-semibold text-[#FFFFFF] tracking-tight">C</span>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-[14px] tracking-[-0.02em] text-[#292927] truncate">
                  Cyqora
                </span>
                <span className="text-[10px] text-[#6F6D68] tracking-wide truncate -mt-0.5">
                  Risk intelligence
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] md:hidden cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Primary navigation */}
        <div className="flex-1 py-4 px-2 overflow-y-auto">
          {!isSidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-[0.08em] text-[#6F6D68]">
              Navigate
            </div>
          )}
          <nav className="space-y-0.5" aria-label="Primary">
            {PRIMARY_NAV.map(renderNavItem)}
          </nav>

          <div className={`mt-6 ${isSidebarCollapsed ? 'pt-2' : ''}`}>
            {!isSidebarCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-semibold tracking-[0.08em] text-[#6F6D68]">
                More
              </div>
            )}
            <nav className="space-y-0.5" aria-label="Secondary">
              {SECONDARY_NAV.map(renderNavItem)}
            </nav>
          </div>
        </div>

        {/* Collapse control */}
        <div className="p-3 border-t border-[rgba(41,41,39,0.08)] flex-shrink-0">
          <button
            onClick={toggleSidebarCollapsed}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex w-full items-center justify-center gap-2 p-2 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors text-[12px] font-medium cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
