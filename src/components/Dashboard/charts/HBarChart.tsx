import { motion } from 'framer-motion';

interface HBarChartProps {
  data: { label: string; value: number; color?: string }[];
  color?: string;
}

const fmt = (v: number) => v > 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString('pt-BR');

export default function HBarChart({ data, color = 'var(--accent-color)' }: HBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="hbar-chart">
      {data.map((item, i) => {
        const barColor = item.color || color;
        return (
          <div key={item.label} className="hbar-row">
            <div className="hbar-label">{item.label}</div>
            <div className="hbar-track">
              <motion.div
                className="hbar-fill"
                style={{ backgroundColor: barColor }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(item.value / maxVal) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            </div>
            <div className="hbar-value">{fmt(item.value)}</div>
          </div>
        );
      })}
    </div>
  );
}
