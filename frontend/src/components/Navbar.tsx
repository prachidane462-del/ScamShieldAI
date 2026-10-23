import React from 'react';
import { Shield, Sparkles, Moon, Sun, Plus, Menu, X, Cpu } from 'lucide-react';
import { SystemHealth } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenNewScan: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  systemHealth: SystemHealth | null;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenNewScan,
  theme,
  onToggleTheme,
  systemHealth,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B1020]/90 dark:bg-[#0B1020]/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-[#0B1020] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            {/* Live radar dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                ScamShield<span className="text-cyan-400 ml-0.5">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v1.0 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Smart Scam & Fraud Detector
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          
          {/* Engine indicator pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            {systemHealth?.ai_provider_configured ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-slate-300 font-medium">
                  AI Neural Engine <span className="text-cyan-400 font-semibold">({systemHealth.ai_provider_name})</span>
                </span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-medium">
                  Rule-Based Engine <span className="text-emerald-400 font-semibold">Active</span>
                </span>
              </>
            )}
          </div>

          {/* New Scan CTA */}
          <button
            onClick={onOpenNewScan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-glow-cyan transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Scan</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors border border-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={onToggleMobileMenu}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>
    </header>
  );
};
