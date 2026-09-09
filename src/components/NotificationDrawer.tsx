import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification } = useApp();

  if (!isOpen) return null;

  const getSeverityBadge = (type: string) => {
    switch (type) {
      case 'critical':
      case 'CRITICAL':
        return {
          icon: AlertOctagon,
          bg: 'bg-[rgba(168,117,112,0.12)] border-[rgba(168,117,112,0.3)] text-[#A87570]',
          dot: 'bg-[#A87570]',
        };
      case 'warning':
      case 'HIGH':
        return {
          icon: AlertTriangle,
          bg: 'bg-[rgba(180,149,98,0.12)] border-[rgba(180,149,98,0.3)] text-[#B49562]',
          dot: 'bg-[#B49562]',
        };
      case 'success':
      case 'SUCCESS':
        return {
          icon: CheckCircle2,
          bg: 'bg-[rgba(113,140,120,0.12)] border-[rgba(113,140,120,0.3)] text-[#718C78]',
          dot: 'bg-[#718C78]',
        };
      default:
        return {
          icon: Info,
          bg: 'bg-[rgba(111,98,117,0.1)] border-[rgba(111,98,117,0.25)] text-[#6F6275]',
          dot: 'bg-[#6F6275]',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(41,41,39,0.35)] transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l border-[rgba(41,41,39,0.08)] shadow-xl flex flex-col justify-between">
          <div className="p-4 border-b border-[rgba(41,41,39,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] flex items-center justify-center text-[#6F6275]">
                <Bell className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#292927] tracking-[-0.01em]">
                  Notifications
                </h3>
                <p className="text-[11px] text-[#6F6D68]">
                  {notifications.length} active
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-[#6F6D68] space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#718C78]" strokeWidth={1.5} />
                <p className="text-[13px] font-medium text-[#6F6D68]">You&apos;re all caught up</p>
                <p className="text-[11px] text-[#6F6D68]">No active advisories.</p>
              </div>
            ) : (
              notifications.map(n => {
                const badge = getSeverityBadge(n.type);
                return (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-lg bg-[#F7F6F2] border border-[rgba(41,41,39,0.06)] relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`} />
                          {n.type.charAt(0).toUpperCase() + n.type.slice(1).toLowerCase()}
                        </span>
                        <span className="text-[10px] text-[#6F6D68] font-mono">{n.timestamp}</span>
                      </div>

                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#6F6D68] hover:text-[#292927] transition-opacity cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </div>

                    <p className="text-[13px] text-[#292927] mt-2 font-medium leading-relaxed">
                      {n.message}
                    </p>

                    <div className="mt-3 pt-2 border-t border-[rgba(41,41,39,0.06)] flex items-center justify-end">
                      <Link
                        to={n.type === 'critical' ? '/threat-intelligence' : '/investment'}
                        onClick={onClose}
                        className="text-[#6F6275] hover:text-[#5A5160] flex items-center gap-1 font-medium text-[11px]"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3.5 border-t border-[rgba(41,41,39,0.08)] flex items-center justify-between text-[12px]">
            <span className="text-[11px] text-[#6F6D68]">Alerts</span>
            <button
              onClick={() => notifications.forEach(n => dismissNotification(n.id))}
              className="text-[11px] text-[#6F6D68] hover:text-[#292927] font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" strokeWidth={1.75} />
              <span>Dismiss all</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
