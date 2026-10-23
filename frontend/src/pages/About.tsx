import React from 'react';
import { Shield, Cpu, Lock, CheckCircle2, AlertTriangle, Layers, ExternalLink, Code2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            System Architecture & Principles
          </span>
          <span className="text-xs text-slate-400">• v1.0.0</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About ScamShield AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          ScamShield AI is an enterprise-grade cybersecurity application built to empower everyday citizens and organizations against digital fraud, social engineering, smishing, and phishing attacks.
        </p>
      </div>

      {/* Detection Engine Architecture */}
      <div className="rounded-3xl border border-slate-800 bg-[#111A2E] p-6 sm:p-8 shadow-xl space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Multi-Tier Hybrid Detection Architecture</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Unlike naive keyword matchers that trigger false positives on innocent words, ScamShield AI combines a deterministic multi-signal heuristic engine with optional large language model (LLM) contextual reasoning:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">1. Heuristic Rule Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes syntactic patterns, coercive urgency triggers, brand homoglyphs, fake job fee demands, and credential harvesting keywords. Operates completely offline with zero latency.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-violet-500/10 text-violet-400">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">2. Passive URL Forensics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspects domain age anomalies, brand typosquatting (Levenshtein & leetspeak homoglyphs), IDN Punycode attacks, and suspicious subdomains with strict SSRF protection.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">3. LLM AI Reasoning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When configured with Google Gemini or OpenAI API keys, the server invokes neural sentiment and social engineering analysis with prompt injection containment boundaries.
            </p>
          </div>

        </div>
      </div>

      {/* Privacy Notice & Threat Data Protection */}
      <div className="rounded-3xl border border-slate-800 bg-[#111A2E] p-6 sm:p-8 shadow-xl space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>Privacy & Untrusted Data Principles</span>
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Strict Untrusted Input Containment:</strong> All scanned messages and URLs are treated strictly as untrusted data, never as system instructions. Prompt injection attempts are neutralized.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">No Malicious Code Execution:</strong> The URL Checker never crawls or executes client-side scripts from submitted target URLs, safeguarding users and host infrastructure.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Server-Side Secret Management:</strong> API keys for AI models and threat databases are managed exclusively on the Python backend via environment variables. No credentials are leaked to the browser.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Client-Local Storage Only:</strong> Audit records remain on your local device. You retain full control to wipe history at any moment.</span>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="rounded-3xl border border-slate-800 bg-[#111A2E] p-6 sm:p-8 shadow-xl space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-violet-400" />
          <span>Technology Stack</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Frontend</span>
            <span className="font-semibold text-white">React 18 & Vite</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Styling</span>
            <span className="font-semibold text-white">Tailwind CSS 3.4</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Language</span>
            <span className="font-semibold text-white">TypeScript 5</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Backend</span>
            <span className="font-semibold text-white">Python 3.13 FastAPI</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1020] text-xs text-slate-400 leading-relaxed space-y-1">
        <strong className="text-slate-300 block">Academic & Public Utility Disclaimer:</strong>
        <p>
          ScamShield AI provides automated algorithmic risk estimates for cybersecurity guidance and education. A low-risk score is not a 100% guarantee of safety, and users should remain vigilant at all times. Never share OTPs, credit card CVVs, or account passwords regardless of tool assessments.
        </p>
      </div>

    </div>
  );
};
