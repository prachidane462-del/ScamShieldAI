import React from 'react';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Link2,
  History,
  ShieldCheck,
  Info,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  historyCount
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'scanner',
      label: 'Message Scanner',
      icon: MessageSquareWarning,
      badge: 'Core'
    },
    {
      id: 'url',
      label: 'URL Checker',
      icon: Link2,
      badge: null
    },
    {
      id: 'history',
      label: 'Scan History',
      icon: History,
      badge: historyCount > 0 ? String(historyCount) : null
    },
    {
      id: 'tips',
      label: 'Security Tips',
      icon: ShieldCheck,
      badge: null
    },
    {
      id: 'about',
      label: 'About & Privacy',
      icon: Info,
      badge: null
    }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-800 bg-[#0B1020] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-4`}
      >
        <div className="space-y-6">
          {/* Main Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Cybersecurity Suite
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badge === 'Core'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Official Cybercrime Helpline Card (India & Global) */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>Emergency Cyber Helpline</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Victim of financial fraud? Dial <span className="font-bold text-rose-300">1930</span> (India) within the golden hour or file at{' '}
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
            >
              cybercrime.gov.in <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </div>
      </aside>
    </>
  );
};
