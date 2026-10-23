import React, { useState } from 'react';
import {
  Shield,
  MessageSquare,
  Link2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ScanHistoryItem } from '../types';

interface DashboardProps {
  onNavigate: (tab: string, initialText?: string) => void;
  recentScans: ScanHistoryItem[];
  stats: {
    total_scans: number;
    scams_detected: number;
    safe_verified: number;
    message_scans: number;
    url_scans: number;
  };
  onViewReport: (item: ScanHistoryItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  recentScans,
  stats,
  onViewReport
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleQuickAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    if (quickInput.startsWith('http') || quickInput.includes('.')) {
      onNavigate('url', quickInput.trim());
    } else {
      onNavigate('scanner', quickInput.trim());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111A2E] via-[#0E1528] to-[#15122B] p-6 sm:p-10 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Generation Anti-Fraud Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Stay One Step Ahead <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">
                of Cyber Scams.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Analyze suspicious messages and links before you trust them. Instantly detect deceptive phishing URLs, fake job offers, banking OTP scams, and social engineering attacks.
            </p>

            {/* Quick Input Bar */}
            <form onSubmit={handleQuickAnalyze} className="pt-2 max-w-lg">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Paste SMS, WhatsApp text, or link..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 pr-28 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 shadow-glow-cyan"
                >
                  Analyze <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('scanner')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-sm shadow-glow-cyan transition-all transform hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Scan a Message</span>
              </button>

              <button
                onClick={() => onNavigate('url')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm hover:border-slate-600 transition-all"
              >
                <Link2 className="w-4 h-4 text-violet-400" />
                <span>Check a URL</span>
              </button>
            </div>
          </div>

          {/* Cybersecurity Shield Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              {/* Concentric security radar rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse-subtle" />
              <div className="absolute inset-4 rounded-full border border-violet-500/20" />
              <div className="absolute inset-10 rounded-full border border-cyan-500/10" />

              {/* Central Glowing Shield */}
              <div className="relative flex items-center justify-center w-36 h-36 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-violet-600/30 to-indigo-900/40 border border-cyan-500/40 backdrop-blur-xl shadow-glow-cyan">
                <Shield className="w-20 h-20 text-cyan-400 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                
                {/* Orbiting security icons */}
                <div className="absolute -top-3 -right-2 p-2 rounded-xl bg-[#0B1020] border border-cyan-500/40 text-cyan-400 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="absolute -bottom-2 -left-2 p-2 rounded-xl bg-[#0B1020] border border-rose-500/40 text-rose-400 shadow-lg">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scans */}
        <div className="rounded-2xl border border-slate-800 bg-[#111A2E] p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Scans Performed</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.total_scans.toLocaleString()}</span>
            <span className="text-xs text-cyan-400 font-medium">Telemetry</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Messages ({stats.message_scans}) + URLs ({stats.url_scans})</p>
        </div>

        {/* Potential Scams Detected */}
        <div className="rounded-2xl border border-rose-500/20 bg-[#111A2E] p-5 shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Potential Scams Detected</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{stats.scams_detected.toLocaleString()}</span>
            <span className="text-xs text-rose-400/80 font-medium font-mono">
              {((stats.scams_detected / Math.max(1, stats.total_scans)) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Threat signatures identified</p>
        </div>

        {/* Safe Results */}
        <div className="rounded-2xl border border-emerald-500/20 bg-[#111A2E] p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Safe Results Verified</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.safe_verified.toLocaleString()}</span>
            <span className="text-xs text-emerald-400/80 font-medium font-mono">
              {((stats.safe_verified / Math.max(1, stats.total_scans)) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Authentic or clean communications</p>
        </div>

        {/* Active Analysis Engine */}
        <div className="rounded-2xl border border-violet-500/20 bg-[#111A2E] p-5 shadow-lg relative overflow-hidden group hover:border-violet-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Detection Heuristics</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-violet-300 tracking-tight">Multi-Tier</span>
            <span className="text-xs text-violet-400 font-medium">Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Lexical, Behavioral & AI Fallback</p>
        </div>

      </div>

      {/* Note about Sample Metrics as required */}
      <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>* Sample dataset statistics shown for demonstration. Individual analysis is calculated in real-time.</span>
        <span className="text-cyan-400 font-mono text-[10px]">Zero-Server-Retention</span>
      </div>

      {/* Quick Action Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: SMS / WhatsApp Message */}
        <div
          onClick={() => onNavigate('scanner')}
          className="rounded-2xl border border-slate-800 bg-[#111A2E] p-6 hover:border-cyan-500/40 cursor-pointer transition-all duration-200 group hover:-translate-y-1 shadow-lg"
        >
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
            Analyze SMS or WhatsApp
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Inspect urgency triggers, OTP harvesting tricks, fake job registration fees, and deceptive tone indicators.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
            <span>Launch Message Scanner</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: URL Checker */}
        <div
          onClick={() => onNavigate('url')}
          className="rounded-2xl border border-slate-800 bg-[#111A2E] p-6 hover:border-violet-500/40 cursor-pointer transition-all duration-200 group hover:-translate-y-1 shadow-lg"
        >
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors">
            Check a Suspicious Link
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Detect typosquatting, deceptive subdomains, raw IP hosts, and abuse-prone TLDs without visiting malicious servers.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
            <span>Launch URL Checker</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Security Tips & Checklist */}
        <div
          onClick={() => onNavigate('tips')}
          className="rounded-2xl border border-slate-800 bg-[#111A2E] p-6 hover:border-emerald-500/40 cursor-pointer transition-all duration-200 group hover:-translate-y-1 shadow-lg"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
            Recognize Phishing Attacks
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Review the interactive Scam Safety Checklist and explore official reporting resources like India 1930 & cybercrime.gov.in.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <span>View Safety Guide</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl border border-slate-800 bg-[#111A2E] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Security Activity</h3>
            <p className="text-xs text-slate-400">Recent message and link investigations conducted on this device</p>
          </div>
          {recentScans.length > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm text-slate-400">No recent scans on record yet.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Scan your first SMS, WhatsApp message, or website link to see detailed vulnerability reports here.
            </p>
            <button
              onClick={() => onNavigate('scanner')}
              className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold hover:bg-cyan-500/20 transition-colors inline-block"
            >
              Scan a Message Now
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentScans.slice(0, 5).map((scan) => {
              const isHigh = scan.risk_level === 'High Risk';
              const isSuspicious = scan.risk_level === 'Suspicious';
              const badgeClass = isHigh
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                : isSuspicious
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

              return (
                <div
                  key={scan.id}
                  onClick={() => onViewReport(scan)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/70 hover:border-slate-700 cursor-pointer transition-all gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                      {scan.type === 'message' ? <MessageSquare className="w-4 h-4 text-cyan-400" /> : <Link2 className="w-4 h-4 text-violet-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-white">{scan.title}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{scan.type}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-md">{scan.preview}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-[11px] text-slate-400">
                      {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                      {scan.risk_score}/100 • {scan.risk_level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
