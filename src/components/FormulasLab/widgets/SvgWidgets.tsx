import { motion } from 'framer-motion';

/** Horizontal bar showing a percentage (0-100) */
export const FrequencyBar = ({ value, color = 'var(--accent-color)' }: { value: number; color?: string }) => (
  <div className="svg-widget" style={{ height: '50px' }}>
    <svg viewBox="0 0 200 30" width="100%" height="30" style={{ flexShrink: 0 }}>
      <rect x="0" y="8" width="200" height="14" rx="7" fill="rgba(255,255,255,0.06)" />
      <motion.rect
        x="0" y="8" height="14" rx="7"
        fill={color}
        initial={{ width: 0 }}
        animate={{ width: (value / 100) * 200 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <text x="205" y="19" fill="var(--text-secondary)" fontSize="10" fontFamily="monospace" dominantBaseline="middle">
        {value.toFixed(1)}%
      </text>
    </svg>
  </div>
);

/** Mini pie chart showing a proportion */
export const MiniPie = ({ value, color = 'var(--accent-color)' }: { value: number; color?: string }) => {
  const r = 14;
  const cx = 20;
  const cy = 20;
  const circumference = 2 * Math.PI * r;
  const dashArray = (value / 100) * circumference;
  return (
    <div className="svg-widget" style={{ height: '50px' }}>
      <svg viewBox="0 0 40 40" width="40" height="40" style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <motion.circle
          cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dashArray }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform="rotate(-90 20 20)"
        />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fill="var(--text-primary)" fontSize="8" fontWeight="700" fontFamily="monospace">
          {value.toFixed(0)}%
        </text>
      </svg>
    </div>
  );
};

/** Régua de amplitude mostrando min e max */
export const RangeRuler = ({ min, max }: { min: number; max: number }) => {
  const range = max - min || 1;
  const markPos = (v: number) => ((v - min) / range) * 180 + 10;
  return (
    <div className="svg-widget" style={{ height: '50px' }}>
      <svg viewBox="0 0 200 40" width="100%" height="40" style={{ flexShrink: 0 }}>
        <line x1="10" y1="20" x2="190" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        {/* Min mark */}
        <motion.line
          x1={markPos(min)} y1="10" x2={markPos(min)} y2="30"
          stroke="var(--info)" strokeWidth="2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        />
        <text x={markPos(min)} y="38" textAnchor="middle" fill="var(--info)" fontSize="8" fontFamily="monospace">
          {min}
        </text>
        {/* Max mark */}
        <motion.line
          x1={markPos(max)} y1="10" x2={markPos(max)} y2="30"
          stroke="var(--error)" strokeWidth="2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        />
        <text x={markPos(max)} y="38" textAnchor="middle" fill="var(--error)" fontSize="8" fontFamily="monospace">
          {max}
        </text>
        {/* Range arrow */}
        <motion.line
          x1={markPos(min)} y1="20" x2={markPos(max)} y2="20"
          stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="4 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </svg>
    </div>
  );
};

/** Mini box-plot showing q1, median, q3 */
export const BoxMini = ({
  q1, median, q3, min, max,
}: { q1: number; median: number; q3: number; min: number; max: number }) => {
  const range = max - min || 1;
  const pos = (v: number) => ((v - min) / range) * 160 + 20;
  return (
    <div className="svg-widget">
      <svg viewBox="0 0 200 50" width="100%" height="50">
        {/* Whiskers */}
        <line x1={pos(min)} y1="25" x2={pos(q1)} y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1={pos(q3)} y1="25" x2={pos(max)} y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        {/* Min/Max caps */}
        <line x1={pos(min)} y1="18" x2={pos(min)} y2="32" stroke="var(--info)" strokeWidth="1.5" />
        <line x1={pos(max)} y1="18" x2={pos(max)} y2="32" stroke="var(--error)" strokeWidth="1.5" />
        {/* Box Q1-Q3 */}
        <motion.rect
          x={pos(q1)} y="12" height="26" rx="3"
          fill="var(--accent-soft)" stroke="var(--accent-color)" strokeWidth="1.5"
          initial={{ width: 0 }} animate={{ width: pos(q3) - pos(q1) }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        {/* Median line */}
        <motion.line
          x1={pos(median)} y1="12" x2={pos(median)} y2="38"
          stroke="var(--lavender)" strokeWidth="2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        />
        {/* Labels */}
        <text x={pos(min)} y="48" textAnchor="middle" fill="var(--info)" fontSize="7" fontFamily="monospace">{min}</text>
        <text x={pos(q1)} y="8" textAnchor="middle" fill="var(--text-secondary)" fontSize="7" fontFamily="monospace">Q1</text>
        <text x={pos(median)} y="8" textAnchor="middle" fill="var(--lavender)" fontSize="7" fontWeight="700" fontFamily="monospace">M</text>
        <text x={pos(q3)} y="8" textAnchor="middle" fill="var(--text-secondary)" fontSize="7" fontFamily="monospace">Q3</text>
        <text x={pos(max)} y="48" textAnchor="middle" fill="var(--error)" fontSize="7" fontFamily="monospace">{max}</text>
      </svg>
    </div>
  );
};

/** Visual for standard deviation — bars showing spread from mean */
export const StdDevBars = ({ mean, stddev }: { mean: number; stddev: number }) => {
  const maxVal = mean + stddev * 2;
  const barWidth = (v: number) => Math.max(0, (v / maxVal) * 180);
  return (
    <div className="svg-widget" style={{ height: '50px' }}>
      <svg viewBox="0 0 200 35" width="100%" height="35" style={{ flexShrink: 0 }}>
        {/* Mean line */}
        <line x1="10" y1="17" x2="190" y2="17" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* -1σ to +1σ bar */}
        <motion.rect
          x="10" y="10" rx="3" fill="var(--accent-soft)" stroke="var(--accent-color)" strokeWidth="1"
          initial={{ width: 0 }} animate={{ width: barWidth(stddev * 2) }}
          transition={{ duration: 1 }}
        />
        {/* Mean marker */}
        <motion.circle
          cy="17" r="3" fill="var(--lavender)"
          initial={{ cx: 10 }} animate={{ cx: 10 + barWidth(mean) }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        <text x="10" y="32" fill="var(--text-secondary)" fontSize="7" fontFamily="monospace">μ-σ</text>
        <text x={10 + barWidth(mean)} y="8" textAnchor="middle" fill="var(--lavender)" fontSize="7" fontWeight="700" fontFamily="monospace">μ</text>
        <text x={10 + barWidth(stddev * 2)} y="32" textAnchor="middle" fill="var(--text-secondary)" fontSize="7" fontFamily="monospace">μ+σ</text>
      </svg>
    </div>
  );
};

/** Visual for CV — traffic light style indicator */
export const CvIndicator = ({ cv }: { cv: number }) => {
  const level = cv < 15 ? 'low' : cv < 30 ? 'medium' : 'high';
  const color = level === 'low' ? 'var(--success)' : level === 'medium' ? 'var(--warning)' : 'var(--error)';
  const label = level === 'low' ? 'Baixa' : level === 'medium' ? 'Moderada' : 'Alta';
  return (
    <div className="svg-widget cv-indicator" style={{ height: '50px' }}>
      <div className="cv-gauge" style={{ height: '10px' }}>
        <motion.div
          className="cv-gauge-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(cv / 2, 100)}%` }}
          transition={{ duration: 1.2 }}
        />
      </div>
      <span className="cv-label" style={{ color }}>{label}</span>
    </div>
  );
};
