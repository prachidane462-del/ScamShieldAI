import React, { useState } from 'react';
import { X, MessageSquare, Link2, Sparkles, ArrowRight } from 'lucide-react';

interface NewScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (type: 'message' | 'url', initialText?: string) => void;
}

export const NewScanModal: React.FC<NewScanModalProps> = ({ isOpen, onClose, onSelectOption }) => {
  const [quickInput, setQuickInput] = useState('');

  if (!isOpen) return null;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    
    // Auto detect if it's a URL or a message
    if (/^(https?:\/\/|www\.)/i.test(quickInput.trim()) || (quickInput.includes('.') && !quickInput.includes(' ') && quickInput.length < 120)) {
      onSelectOption('url', quickInput.trim());
    } else {
      onSelectOption('message', quickInput.trim());
    }
    setQuickInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#111A2E] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Start a New Security Scan</h3>
            <p className="text-xs text-slate-400">Paste any suspicious content or select a tool below</p>
          </div>
        </div>

        {/* Quick Universal Input */}
        <form onSubmit={handleQuickSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Paste suspicious text or link here..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 pr-24"
              autoFocus
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Scan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-400">Or Select Scanner</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Category Pickers */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={() => {
              onSelectOption('message');
              onClose();
            }}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm text-white">Message Scanner</span>
            <span className="text-xs text-slate-400 mt-1">SMS, WhatsApp, Email, Job Offers</span>
          </button>

          <button
            onClick={() => {
              onSelectOption('url');
              onClose();
            }}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-violet-500/40 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 mb-2 group-hover:scale-110 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm text-white">URL Checker</span>
            <span className="text-xs text-slate-400 mt-1">Phishing links, Typosquatting</span>
          </button>
        </div>
      </div>
    </div>
  );
};
