import { motion } from 'framer-motion';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  color?: string;
  height?: number;
  compact?: boolean;
}

const fmt = (v: number) => v > 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString('pt-BR');

export default function BarChart({ data, color = 'var(--accent-color)', height = 200, compact = false }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`bar-chart${compact ? ' compact' : ''}`} style={{ minHeight: height + 60 }}>
      {data.map((item, i) => {
        const h = (item.value / maxVal) * height;
        const barColor = item.color || color;
        return (
          <div key={item.label} className="bar-col">
            <div className="bar-value">{fmt(item.value)}</div>
            <div className="bar-track" style={{ height }}>
              <motion.div
                className="bar-fill"
                style={{ backgroundColor: barColor }}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}px` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            </div>
            <div className="bar-label">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
