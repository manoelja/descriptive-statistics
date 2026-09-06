import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { IdadeBin } from '../../../data/srag';

interface HistogramProps {
  bins: IdadeBin[];
  color?: string;
  label?: string;
}

export default function Histogram({ bins, color = '#16a34a', label }: HistogramProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxCount = useMemo(() => Math.max(...bins.map((b) => b.count), 1), [bins]);
  const totalCount = useMemo(() => bins.reduce((s, b) => s + b.count, 0), [bins]);

  const stats = useMemo(() => {
    const flat: number[] = [];
    for (const b of bins) {
      for (let i = 0; i < b.count; i++) flat.push(b.binStart + 2.5);
    }
    if (flat.length === 0) return { mean: 0, median: 0, mode: 0, stddev: 0 };
    const mean = flat.reduce((s, v) => s + v, 0) / flat.length;
    const sorted = [...flat].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const modeBin = bins.reduce((max, b) => b.count > max.count ? b : max, bins[0]);
    const mode = modeBin ? modeBin.binStart + 2.5 : 0;
    const variance = flat.reduce((s, v) => s + (v - mean) ** 2, 0) / flat.length;
    return { mean, median, mode, stddev: Math.sqrt(variance) };
  }, [bins]);

  const W = 720;
  const H = 300;
  const pad = { top: 24, right: 24, bottom: 56, left: 65 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const barW = plotW / bins.length;

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const niceMax = Math.ceil(maxCount / 1000) * 1000;
    const step = niceMax / 5;
    for (let i = 0; i <= 5; i++) ticks.push(Math.round(step * i));
    return ticks;
  }, [maxCount]);

  return (
    <div className="histogram-container">
      {label && <div className="histogram-label">{label}</div>}

      <div className="histogram-stats">
        <div className="stat-item">
          <span className="stat-label">Media</span>
          <span className="stat-value">{stats.mean.toFixed(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mediana</span>
          <span className="stat-value">{stats.median.toFixed(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moda</span>
          <span className="stat-value">{stats.mode.toFixed(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Desvio</span>
          <span className="stat-value">{stats.stddev.toFixed(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalCount.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div className="histogram-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="histogram-svg">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={color} stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.55" />
            </linearGradient>
            <filter id="barShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Y axis grid */}
          {yTicks.map((tick, i) => {
            const y = pad.top + plotH - (tick / maxCount) * plotH;
            return (
              <g key={i}>
                <line
                  x1={pad.left} y1={y} x2={W - pad.right} y2={y}
                  stroke="var(--grid-line)" strokeWidth="1"
                  strokeDasharray={i === 0 ? 'none' : '3,3'}
                />
                <text
                  x={pad.left - 10} y={y + 3.5}
                  fill="var(--text-muted)" fontSize="9" textAnchor="end" fontFamily="monospace"
                >
                  {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {bins.map((bin, i) => {
            const x = pad.left + i * barW;
            const barH = (bin.count / maxCount) * plotH;
            const y = pad.top + plotH - barH;
            const isHovered = hoveredIdx === i;
            const pct = totalCount > 0 ? ((bin.count / totalCount) * 100) : 0;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                <motion.rect
                  x={x + 1.5}
                  y={y}
                  width={Math.max(barW - 3, 2)}
                  height={barH}
                  fill={isHovered ? 'url(#barGradHover)' : 'url(#barGrad)'}
                  rx="2"
                  filter={isHovered ? 'url(#barShadow)' : undefined}
                  initial={{ height: 0, y: pad.top + plotH }}
                  whileInView={{ height: barH, y }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.015, ease: [0.22, 0.61, 0.36, 1] }}
                />

                {/* Count on bar */}
                {barH > 22 && (
                  <text
                    x={x + barW / 2} y={y + 12}
                    fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontWeight="700" fontFamily="monospace"
                    style={{ pointerEvents: 'none' }}
                  >
                    {bin.count >= 1000 ? `${(bin.count / 1000).toFixed(1)}k` : bin.count}
                  </text>
                )}

                {/* X axis label */}
                <text
                  x={x + barW / 2} y={H - pad.bottom + 14}
                  fill={isHovered ? 'var(--accent-color)' : 'var(--text-muted)'}
                  fontSize={bins.length > 15 ? '6.5' : '7.5'}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight={isHovered ? '700' : '400'}
                >
                  {bin.binStart}
                </text>

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + barW / 2 - 52} y={Math.max(y - 52, 4)}
                      width="104" height="44" rx="6"
                      fill="var(--bg-tooltip)" stroke="var(--accent-color)" strokeWidth="1"
                    />
                    <text x={x + barW / 2} y={Math.max(y - 52, 4) + 16} fill="white" fontSize="9" textAnchor="middle" fontWeight="700" fontFamily="monospace">
                      {bin.label}
                    </text>
                    <text x={x + barW / 2} y={Math.max(y - 52, 4) + 30} fill="#22d3ee" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                      {bin.count.toLocaleString('pt-BR')} casos ({pct.toFixed(1)}%)
                    </text>
                    <text x={x + barW / 2} y={Math.max(y - 52, 4) + 42} fill="var(--text-muted)" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                      densidade: {(bin.density ?? 0).toFixed(4)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Mean line */}
          {(() => {
            const meanIdx = bins.findIndex((b) => stats.mean >= b.binStart && stats.mean < b.binEnd);
            if (meanIdx < 0) return null;
            const meanX = pad.left + meanIdx * barW + ((stats.mean - bins[meanIdx].binStart) / 5) * barW;
            return (
              <g>
                <line x1={meanX} y1={pad.top} x2={meanX} y2={pad.top + plotH} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,3" />
                <text x={meanX + 4} y={pad.top + 10} fill="#f472b6" fontSize="7.5" fontWeight="600" fontFamily="monospace">
                  media={stats.mean.toFixed(1)}
                </text>
              </g>
            );
          })()}

          {/* Median line */}
          {(() => {
            const medianIdx = bins.findIndex((b) => stats.median >= b.binStart && stats.median < b.binEnd);
            if (medianIdx < 0) return null;
            const medianX = pad.left + medianIdx * barW + ((stats.median - bins[medianIdx].binStart) / 5) * barW;
            return (
              <g>
                <line x1={medianX} y1={pad.top} x2={medianX} y2={pad.top + plotH} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" />
                <text x={medianX + 4} y={pad.top + 22} fill="#fbbf24" fontSize="7.5" fontWeight="600" fontFamily="monospace">
                  mediana={stats.median.toFixed(1)}
                </text>
              </g>
            );
          })()}

          {/* Axes */}
          <line x1={pad.left} y1={pad.top + plotH} x2={W - pad.right} y2={pad.top + plotH} stroke="var(--grid-line-bold)" strokeWidth="1" />
          <text x={W / 2} y={H - 6} fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontWeight="600">
            Idade (anos)
          </text>
          <text x={14} y={H / 2} fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontWeight="600" transform={`rotate(-90, 14, ${H / 2})`}>
            Casos
          </text>
        </svg>
      </div>
    </div>
  );
}
