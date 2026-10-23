import React from 'react';
import { X, Copy, Check, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Calendar, Cpu } from 'lucide-react';
import { ScanHistoryItem, MessageAnalysisResponse, UrlAnalysisResponse } from '../types';
import { RiskGauge } from './RiskGauge';

interface ReportModalProps {
  item: ScanHistoryItem | null;
  onClose: () => void;
  onCopyReport: (text: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ item, onClose, onCopyReport }) => {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const report = item.full_report;
  const isMessage = item.type === 'message';
  const messageReport = isMessage ? (report as MessageAnalysisResponse) : null;
  const urlReport = !isMessage ? (report as UrlAnalysisResponse) : null;

  const handleCopy = () => {
    const text = `ScamShield AI Security Audit Report
Scan ID: ${item.id}
Date: ${new Date(item.timestamp).toLocaleString()}
Type: ${item.type.toUpperCase()}
Risk Score: ${item.risk_score}/100 (${item.risk_level})
Summary: ${report.summary}

Detected Signals:
${report.detected_signals.map(s => `- [${s.severity.toUpperCase()}] ${s.title}: ${s.description}`).join('\n')}

Evidence:
${report.evidence.join(', ') || 'None'}

Recommended Actions:
${report.recommended_actions.map(a => `• ${a}`).join('\n')}

Disclaimer: ${report.limitations}`;

    onCopyReport(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#111A2E] p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {item.type.toUpperCase()} AUDIT
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Score & Summary Banner */}
        <div className="my-5 p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center gap-5">
          <RiskGauge score={item.risk_score} level={item.risk_level} size="md" />
          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-semibold text-slate-100 mb-1">Security Assessment Summary</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{report.summary}</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Engine: {report.engine_used}</span>
            </div>
          </div>
        </div>

        {/* Content Snippet */}
        <div className="mb-5 p-3 rounded-lg bg-[#0B1020] border border-slate-800">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Target Content Analyzed</span>
          <p className="text-xs text-slate-300 font-mono break-all">{item.preview}</p>
        </div>

        {/* Detected Warning Signals */}
        <div className="space-y-2 mb-5">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Detected Warning Signals ({report.detected_signals.length})
          </h4>
          {report.detected_signals.length === 0 ? (
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No malicious or suspicious fraud indicators detected in this content.
            </div>
          ) : (
            report.detected_signals.map((sig, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start gap-3"
              >
                {sig.severity === 'critical' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : sig.severity === 'high' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-slate-200">{sig.title}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {sig.category}
                    </span>
                  </div>
                  <p className="text-slate-400">{sig.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recommended Actions */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Recommended Next Steps</h4>
          <ul className="space-y-1.5">
            {report.recommended_actions.map((act, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <p className="text-[10px] text-slate-400 italic max-w-xs">{report.limitations}</p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Audit Report'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
