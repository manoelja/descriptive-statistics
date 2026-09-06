import { motion } from 'framer-motion';

interface StackedBarProps {
  rows: { label: string; segments: { value: number; color: string; label: string }[] }[];
}

const fmt = (v: number) => v > 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString('pt-BR');

export default function StackedBar({ rows }: StackedBarProps) {
  return (
    <div className="hbar-chart">
      {rows.map((row, i) => {
        const total = row.segments.reduce((s, seg) => s + seg.value, 0) || 1;
        return (
          <div key={row.label} className="hbar-row">
            <div className="hbar-label">{row.label}</div>
            <div className="hbar-track tall">
              <div className="stacked-bar">
                {row.segments.map((seg, j) => (
                  <motion.div
                    key={seg.label}
                    className="stacked-segment"
                    style={{ backgroundColor: seg.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(seg.value / total) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.03 + j * 0.02 }}
                  />
                ))}
              </div>
            </div>
            <div className="hbar-value">{fmt(total)}</div>
          </div>
        );
      })}
    </div>
  );
}
