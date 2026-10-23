import React, { useState, useEffect } from 'react';
import {
  Link2,
  Globe,
  Lock,
  Unlock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Server
} from 'lucide-react';
import { SAMPLE_URLS } from '../data/sampleMessages';
import { UrlAnalysisResponse } from '../types';
import { apiService } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';

interface UrlCheckerProps {
  initialUrl?: string;
  onScanComplete: (report: UrlAnalysisResponse, originalUrl: string) => void;
  onToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

export const UrlChecker: React.FC<UrlCheckerProps> = ({
  initialUrl = '',
  onScanComplete,
  onToast
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [report, setReport] = useState<UrlAnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setReport(null);
  };

  const handleClear = () => {
    setUrl('');
    setReport(null);
  };

  const handleAnalyze = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      onToast('error', 'Empty URL', 'Please enter or paste a URL to inspect.');
      return;
    }

    setIsScanning(true);
    setReport(null);

    const steps = [
      'Validating URL syntax & sanitizing protocol...',
      'Enforcing SSRF protection against loopback & private IPs...',
      'Deconstructing hostname, subdomains & root domain...',
      'Evaluating homoglyphs, Punycode & brand typosquatting...',
      'Inspecting TLD risk rating & sensitive path tokens...',
      'Cross-referencing threat intelligence feeds...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 140));
    }

    try {
      const result = await apiService.analyzeUrl(trimmed);
      setReport(result);
      onScanComplete(result, trimmed);
      onToast(
        result.risk_level === 'High Risk' ? 'warning' : 'success',
        `URL Inspection: ${result.risk_level}`,
        `Risk Score: ${result.risk_score}/100`
      );
    } catch (err: any) {
      onToast('error', 'Inspection Failed', err.message || 'Could not analyze URL.');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    const text = `ScamShield AI URL Security Inspection
Target URL: ${report.url}
Hostname: ${report.hostname}
Root Domain: ${report.domain}
Risk Score: ${report.risk_score}/100 (${report.risk_level})
Summary: ${report.summary}

Security Checks:
• HTTPS: ${report.checks.has_https ? 'Active (Encrypted)' : 'Insecure (HTTP)'}
• Raw IP: ${report.checks.is_ip_address ? 'YES (High Risk)' : 'No'}
• Suspicious TLD: ${report.checks.suspicious_tld ? 'YES' : 'Standard'}
• Typosquatting: ${report.checks.has_typosquatting ? `YES (Target: ${report.checks.target_brand})` : 'No'}
• Subdomain Spoofing: ${report.checks.excessive_subdomains ? 'YES' : 'No'}

Detected Signals:
${report.detected_signals.map(s => `- [${s.severity.toUpperCase()}] ${s.title}`).join('\n')}

Recommended Actions:
${report.recommended_actions.map(a => `• ${a}`).join('\n')}

Disclaimer: ${report.limitations}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('success', 'Report Copied', 'URL audit details copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
            Link Analysis Engine
          </span>
          <span className="text-xs text-slate-400">• Structural Phishing & Typosquatting Inspection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Suspicious URL & Phishing Link Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Inspect website addresses before clicking. Detects brand typosquatting, deceptive subdomains, IP-address links, and suspicious domain extensions without loading malicious web code.
        </p>
      </div>

      {/* Preset Test URLs */}
      <div className="rounded-2xl border border-slate-800 bg-[#111A2E] p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Sample Phishing Scenarios
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click to test different URL structures
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_URLS.map((sample, i) => (
            <button
              key={i}
              onClick={() => handleSelectSample(sample.url)}
              className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-violet-400 transition-colors">
                  {sample.title}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    sample.tag === 'High Risk'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {sample.tag}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">{sample.url}</p>
            </button>
          ))}
        </div>
      </div>

      {/* URL Input Form */}
      <div className="rounded-2xl border border-slate-800 bg-[#111A2E] p-6 shadow-xl relative">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Enter Website Address or Link:
        </label>
        
        <div className="relative flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://paypa1-security.xyz/login/verify or suspicious-domain.com"
              className="w-full rounded-xl border border-slate-700 bg-[#0B1020] pl-10 pr-24 py-3.5 text-sm text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 font-mono transition-colors shadow-inner"
            />
            {url && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isScanning || !url.trim()}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-violet transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Shield className="w-4 h-4" />
            <span>{isScanning ? 'Inspecting...' : 'Analyze URL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="mt-4 p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Running Static Security Inspection</span>
              <span className="text-violet-300 font-mono">{scanStep}</span>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>• Passive static inspection: We never execute JavaScript or load dangerous payloads from this URL.</span>
          <span className="text-emerald-400 font-mono hidden sm:inline">SSRF Protected</span>
        </div>
      </div>

      {/* Analysis Report */}
      {report && (
        <div className="rounded-3xl border border-slate-800 bg-[#111A2E] p-6 sm:p-8 shadow-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-violet-400">
                  URL THREAT INTELLIGENCE REPORT
                </span>
                <span className="text-[11px] text-slate-400">• Scan ID: {report.scan_id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Domain & Host Diagnostics
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>

              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-semibold transition-colors border border-violet-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check Another Link</span>
              </button>
            </div>
          </div>

          {/* Primary Assessment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
            <div className="md:col-span-4 flex justify-center">
              <RiskGauge score={report.risk_score} level={report.risk_level} size="lg" />
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-bold uppercase">Assessment Verdict</span>
                <span>• Engine: {report.engine_used}</span>
              </div>

              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                {report.summary}
              </p>

              {/* Parsed Domain Overview Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-[#0B1020] border border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Resolved Hostname</span>
                  <span className="font-mono text-cyan-400 font-semibold break-all">{report.hostname || 'None'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1020] border border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Owning Root Domain</span>
                  <span className="font-mono text-violet-400 font-semibold break-all">{report.domain || 'None'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Diagnostic Checks Grid */}
          <div className="space-y-3">
            <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider">
              Diagnostic Security Checks
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Check 1: HTTPS */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-1">
                {report.checks.has_https ? (
                  <Lock className="w-5 h-5 text-emerald-400 mx-auto" />
                ) : (
                  <Unlock className="w-5 h-5 text-rose-400 mx-auto" />
                )}
                <span className="text-[10px] uppercase font-bold text-slate-400 block">HTTPS / TLS</span>
                <span className={`text-xs font-semibold ${report.checks.has_https ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {report.checks.has_https ? 'Encrypted' : 'Insecure (HTTP)'}
                </span>
              </div>

              {/* Check 2: Typosquatting */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-1">
                <AlertTriangle className={`w-5 h-5 mx-auto ${report.checks.has_typosquatting ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Typosquatting</span>
                <span className={`text-xs font-semibold ${report.checks.has_typosquatting ? 'text-rose-400' : 'text-slate-300'}`}>
                  {report.checks.has_typosquatting ? `Mimics ${report.checks.target_brand}` : 'Clean'}
                </span>
              </div>

              {/* Check 3: Raw IP */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-1">
                <Server className={`w-5 h-5 mx-auto ${report.checks.is_ip_address ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Host Type</span>
                <span className={`text-xs font-semibold ${report.checks.is_ip_address ? 'text-rose-400' : 'text-slate-300'}`}>
                  {report.checks.is_ip_address ? 'Raw IP (High Risk)' : 'Domain Name'}
                </span>
              </div>

              {/* Check 4: Subdomains */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-1">
                <Layers className={`w-5 h-5 mx-auto ${report.checks.excessive_subdomains ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subdomains</span>
                <span className={`text-xs font-semibold ${report.checks.excessive_subdomains ? 'text-amber-400' : 'text-slate-300'}`}>
                  {report.checks.excessive_subdomains ? 'Deceptive Subdomain' : 'Normal'}
                </span>
              </div>

              {/* Check 5: High-Abuse TLD */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-1">
                <Globe className={`w-5 h-5 mx-auto ${report.checks.suspicious_tld ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Extension</span>
                <span className={`text-xs font-semibold ${report.checks.suspicious_tld ? 'text-amber-400' : 'text-slate-300'}`}>
                  {report.checks.suspicious_tld ? 'High-Abuse TLD' : 'Standard TLD'}
                </span>
              </div>

              {/* Check 6: Threat Intel */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-1">
                <Shield className="w-5 h-5 text-cyan-400 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Threat Intel</span>
                <span className="text-xs font-semibold text-cyan-400">
                  {report.checks.safe_browsing_checked ? (report.checks.safe_browsing_flagged ? 'Flagged' : 'Clean') : 'Heuristic Active'}
                </span>
              </div>

            </div>
          </div>

          {/* Detected Warning Signals */}
          <div className="space-y-3">
            <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider">
              Identified Threat Signals ({report.detected_signals.length})
            </h3>

            {report.detected_signals.length === 0 ? (
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>The URL structure conforms to standard legitimate web addressing.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.detected_signals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{sig.title}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {sig.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{sig.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Countermeasures */}
          <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-950/20 space-y-3">
            <h4 className="text-xs uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Recommended Browsing Precautions</span>
            </h4>
            <ul className="space-y-2">
              {report.recommended_actions.map((act, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5">
                  <span className="text-violet-400 font-bold mt-0.5">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Educational Note about HTTPS */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 text-xs text-amber-200/90 leading-relaxed space-y-1">
            <span className="font-bold uppercase tracking-wider block text-amber-300">
              Security Education: The HTTPS Myth
            </span>
            <p>
              Having a padlock or HTTPS status does NOT mean a website is legitimate! Over 80% of modern phishing websites obtain free SSL certificates. HTTPS only encrypts the traffic between you and the server; it does not protect you if the server itself belongs to a cybercriminal. Always verify the domain spelling.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
