import React, { useState } from 'react';
import {
  History,
  Trash2,
  Download,
  Filter,
  MessageSquare,
  Link2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  Search,
  Eye
} from 'lucide-react';
import { ScanHistoryItem } from '../types';

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onViewReport: (item: ScanHistoryItem) => void;
  onToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onClearHistory,
  onDeleteItem,
  onViewReport,
  onToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'message' | 'url'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'High Risk' | 'Suspicious' | 'Low Risk'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter history items
  const filteredItems = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.type === categoryFilter;
    const matchesRisk = riskFilter === 'all' || item.risk_level === riskFilter;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const handleExportJson = () => {
    if (history.length === 0) {
      onToast('info', 'No History to Export', 'Perform some scans before exporting.');
      return;
    }
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scamshield-scan-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('success', 'Export Successful', 'Downloaded local audit history as JSON.');
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setShowClearConfirm(false);
    onToast('success', 'History Cleared', 'All local scan records permanently removed.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Audit Logs
            </span>
            <span className="text-xs text-slate-400">• Local Device Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Security Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review past message analyses and link inspections saved locally in your browser.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 disabled:opacity-40"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors border border-rose-500/20 disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner as required */}
      <div className="p-4 rounded-2xl border border-cyan-500/20 bg-[#111A2E] flex items-start gap-3">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-bold text-white block">Zero-Cloud Client-Side Privacy Architecture</span>
          <p className="leading-relaxed">
            Your scan history is stored exclusively in your local browser storage (<code className="text-cyan-300">localStorage</code>). No message contents or URLs are saved permanently on our servers or sold to third parties. You have complete control to wipe records anytime.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-[#111A2E] p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, domains, titles..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e: any) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="message">Messages</option>
            <option value="url">URLs</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e: any) => setRiskFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="High Risk">High Risk (60-100)</option>
            <option value="Suspicious">Suspicious (30-59)</option>
            <option value="Low Risk">Low Risk (0-29)</option>
          </select>
        </div>

      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#111A2E]/60 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Scan Records</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {history.length === 0
              ? 'You have not scanned any messages or links yet. Conduct your first scan to generate an audit log.'
              : 'No items match your active search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isHigh = item.risk_level === 'High Risk';
            const isSuspicious = item.risk_level === 'Suspicious';
            const badgeClass = isHigh
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              : isSuspicious
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-[#111A2E] p-4 sm:p-5 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                    {item.type === 'message' ? (
                      <MessageSquare className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Link2 className="w-5 h-5 text-violet-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white truncate">{item.title}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono truncate max-w-xl">
                      {item.preview}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
                    {item.risk_score}/100 • {item.risk_level}
                  </span>

                  <button
                    onClick={() => onViewReport(item)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="View Full Audit Report"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#111A2E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Clear All Scan History?</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete all <span className="font-bold text-white">{history.length}</span> scan records stored locally on this browser? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-glow-rose"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
