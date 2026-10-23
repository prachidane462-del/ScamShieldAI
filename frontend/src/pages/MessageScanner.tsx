import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Clipboard,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Cpu,
  ArrowRight,
  Shield,
  Layers,
  ChevronDown
} from 'lucide-react';
import { SAMPLE_MESSAGES, SampleMessage } from '../data/sampleMessages';
import { MessageAnalysisResponse } from '../types';
import { apiService } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';

interface MessageScannerProps {
  initialContent?: string;
  onScanComplete: (report: MessageAnalysisResponse, originalText: string) => void;
  onToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({
  initialContent = '',
  onScanComplete,
  onToast
}) => {
  const [content, setContent] = useState(initialContent);
  const [sourceType, setSourceType] = useState('auto');
  const [useAi, setUseAi] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [report, setReport] = useState<MessageAnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedSample, setSelectedSample] = useState('');

  // Auto populate if initialContent provided from Dashboard or Modal
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  // Handle Ctrl+Enter keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleClear = () => {
    setContent('');
    setReport(null);
    setSelectedSample('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        onToast('info', 'Pasted from Clipboard', 'Message input updated.');
      }
    } catch {
      onToast('warning', 'Clipboard Access Denied', 'Please press Ctrl+V to paste manually.');
    }
  };

  const handleSelectSample = (sample: SampleMessage) => {
    setContent(sample.content);
    setSourceType(sample.source_type);
    setSelectedSample(sample.id);
    setReport(null);
  };

  const handleAnalyze = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      onToast('error', 'Empty Message', 'Please paste or type a message to analyze.');
      return;
    }
    if (trimmed.length < 5) {
      onToast('warning', 'Message Too Short', 'Please enter a longer sample for accurate heuristics.');
      return;
    }
    if (trimmed.length > 4000) {
      onToast('error', 'Message Too Long', 'Max 4000 characters supported.');
      return;
    }

    setIsScanning(true);
    setReport(null);

    // Multi-stage scan progress simulation
    const steps = [
      'Normalizing text & extracting lexical patterns...',
      'Evaluating coercive urgency & threat indicators...',
      'Scanning for credential harvesting & OTP requests...',
      'Cross-referencing brand impersonations & suspicious links...',
      'Computing composite cybersecurity risk score...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }

    try {
      const result = await apiService.analyzeMessage(trimmed, sourceType, useAi);
      setReport(result);
      onScanComplete(result, trimmed);
      onToast(
        result.risk_level === 'High Risk' ? 'warning' : 'success',
        `Analysis Complete: ${result.risk_level}`,
        `Composite Risk Score: ${result.risk_score}/100`
      );
    } catch (err: any) {
      onToast('error', 'Analysis Failed', err.message || 'Could not complete scan.');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    const text = `ScamShield AI Audit Report
Scan ID: ${report.scan_id}
Date: ${new Date(report.analyzed_at).toLocaleString()}
Risk Score: ${report.risk_score}/100 (${report.risk_level})
Summary: ${report.summary}

Detected Signals:
${report.detected_signals.map(s => `- [${s.severity.toUpperCase()}] ${s.title}: ${s.description}`).join('\n')}

Evidence:
${report.evidence.join(', ') || 'None'}

Recommended Actions:
${report.recommended_actions.map(a => `• ${a}`).join('\n')}

Disclaimer: ${report.limitations}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('success', 'Report Copied', 'Full analysis report copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Core Security Module
          </span>
          <span className="text-xs text-slate-400">• Multi-Signal Threat Detection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Message & Communication Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Paste any SMS, WhatsApp chat, email, or unsolicited job offer to detect psychological manipulation, urgent intimidation, OTP traps, and fee-advance fraud.
        </p>
      </div>

      {/* Preset Test Messages Selector */}
      <div className="rounded-2xl border border-slate-800 bg-[#111A2E] p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Quick Test Presets (Demo Mode)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any scenario to populate the scanner
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SAMPLE_MESSAGES.map((sample) => {
            const isSelected = selectedSample === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-glow-cyan'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {sample.category.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      sample.tag === 'Scam'
                        ? 'bg-rose-500/20 text-rose-300'
                        : sample.tag === 'Suspicious'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {sample.tag}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 line-clamp-1">{sample.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Box Section */}
      <div className="rounded-2xl border border-slate-800 bg-[#111A2E] p-5 sm:p-6 shadow-xl relative">
        
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-300">Communication Type:</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="auto">Auto-Detect</option>
              <option value="sms">SMS Text</option>
              <option value="whatsapp">WhatsApp / Chat</option>
              <option value="email">Email</option>
              <option value="job">Job Offer / Task</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>

            <button
              onClick={handleClear}
              disabled={!content}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste a suspicious SMS, WhatsApp message, email, or job offer here..."
            rows={7}
            maxLength={4000}
            className="w-full rounded-xl border border-slate-700 bg-[#0B1020] p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors font-sans resize-y leading-relaxed"
          />

          {/* Progress Overlay during scanning */}
          {isScanning && (
            <div className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-white block">Evaluating Threat Signatures</span>
                <span className="text-xs text-cyan-400 font-mono mt-1 block animate-pulse">
                  {scanStep || 'Inspecting token patterns...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status & Analyze Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              Characters: <span className="font-mono text-slate-300">{charCount}</span>/4000
            </span>
            <span>
              Words: <span className="font-mono text-slate-300">{wordCount}</span>
            </span>
            <span className="hidden md:inline text-slate-400">
              Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono">Ctrl + Enter</kbd>
            </span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isScanning || !content.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-glow-cyan transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Shield className="w-4 h-4" />
            <span>{isScanning ? 'Scanning...' : 'Analyze Message'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Analysis Results Report */}
      {report && (
        <div className="rounded-3xl border border-slate-800 bg-[#111A2E] p-6 sm:p-8 shadow-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
                  SCAMSHIELD AI AUDIT REPORT
                </span>
                <span className="text-[11px] text-slate-400">• Scan ID: {report.scan_id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Security Analysis Breakdown
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold transition-colors border border-cyan-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another Message</span>
              </button>
            </div>
          </div>

          {/* Primary Assessment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
            
            {/* Score Circular Gauge */}
            <div className="md:col-span-4 flex justify-center">
              <RiskGauge score={report.risk_score} level={report.risk_level} size="lg" />
            </div>

            {/* Explanation & Summary */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-slate-400">Risk Verdict</span>
                <span className="text-xs text-slate-400">• Source: {report.source_type_detected.toUpperCase()}</span>
                <span className="text-xs text-slate-400">• Engine: {report.engine_used}</span>
              </div>

              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                {report.summary}
              </p>

              {/* Progress Bar Breakdown */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Threat Intensity Meter</span>
                  <span className="font-mono text-cyan-400 font-bold">{report.risk_score} / 100</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      report.risk_level === 'High Risk'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : report.risk_level === 'Suspicious'
                        ? 'bg-gradient-to-r from-cyan-400 to-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(5, report.risk_score)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 (Low Risk)</span>
                  <span>30 (Suspicious)</span>
                  <span>60 (High Risk)</span>
                  <span>100 (Critical)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Detected Warning Signals */}
          <div className="space-y-3">
            <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Detected Warning Signs & Heuristic Triggers ({report.detected_signals.length})</span>
            </h3>

            {report.detected_signals.length === 0 ? (
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>No aggressive fraud signals or credential harvesting keywords were identified in this message.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.detected_signals.map((sig, idx) => {
                  const isCrit = sig.severity === 'critical';
                  const isHigh = sig.severity === 'high';
                  const borderCol = isCrit ? 'border-rose-500/30 bg-rose-950/20' : isHigh ? 'border-amber-500/30 bg-amber-950/20' : 'border-slate-800 bg-slate-900/40';
                  const badgeCol = isCrit ? 'bg-rose-500/20 text-rose-300' : isHigh ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300';

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${borderCol} space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{sig.title}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badgeCol}`}>
                          {sig.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{sig.description}</p>
                      {sig.evidence.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase font-semibold text-slate-400">Tokens:</span>
                          {sig.evidence.map((ev, i) => (
                            <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-rose-300 border border-slate-700">
                              {ev}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trigger Words / Evidence Section */}
          {report.evidence.length > 0 && (
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Extracted Evidence Tokens
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.evidence.map((token, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs"
                  >
                    "{token}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Next Steps */}
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 space-y-3">
            <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Recommended Security Countermeasures</span>
            </h4>
            <ul className="space-y-2">
              {report.recommended_actions.map((act, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transparent Disclaimer Notice as required */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1020] text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 uppercase tracking-wider block">Notice & Methodological Limitations</span>
            <p className="leading-relaxed">{report.limitations}</p>
          </div>

        </div>
      )}

    </div>
  );
};
