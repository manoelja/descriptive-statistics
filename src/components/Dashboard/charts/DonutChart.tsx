import { useMemo } from 'react';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export default function DonutChart({ data, size = 200 }: DonutChartProps) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0) || 1, [data]);
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
        {data.map((item, i) => {
          const frac = item.value / total;
          const dash = frac * circumference;
          const start = data.slice(0, i).reduce((s, d) => s + d.value, 0) * (circumference / total);
          return (
            <circle
              key={item.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth={size * 0.13}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-start}
              style={{ transition: 'all 0.3s' }}
            />
          );
        })}
        <text x={cx} y={cy - 4} fill="var(--text-primary)" fontSize="14" textAnchor="middle" fontWeight="800">
          {total.toLocaleString('pt-BR')}
        </text>
        <text x={cx} y={cy + 12} fill="var(--text-secondary)" fontSize="8" textAnchor="middle">
          total
        </text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
            <span>{item.label}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{((item.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
