import React from 'react';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 'md' }) => {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine colors based on cybersecurity risk levels
  let colorClass = 'text-emerald-400 stroke-emerald-400';
  let bgClass = 'stroke-emerald-950/40';
  let glowClass = 'shadow-glow-emerald';
  let badgeBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

  if (level === 'High Risk' || clampedScore >= 60) {
    colorClass = 'text-rose-500 stroke-rose-500';
    bgClass = 'stroke-rose-950/40';
    glowClass = 'shadow-glow-rose';
    badgeBg = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  } else if (level === 'Suspicious' || clampedScore >= 30) {
    colorClass = 'text-amber-400 stroke-amber-400';
    bgClass = 'stroke-amber-950/40';
    glowClass = 'shadow-glow-amber';
    badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }

  // Dimensions
  const radius = size === 'sm' ? 36 : size === 'lg' ? 68 : 52;
  const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
  const dimension = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center rounded-full ${glowClass}`}>
        <svg
          width={dimension}
          height={dimension}
          className="transform -rotate-90 transition-all duration-700 ease-out"
        >
          {/* Background track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={`${bgClass} transition-colors`}
          />
          {/* Progress arc */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-bold tracking-tight ${size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'} ${colorClass}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div className={`mt-3 px-3 py-0.5 rounded-full border text-xs font-semibold tracking-wide ${badgeBg}`}>
        {level}
      </div>
    </div>
  );
};
