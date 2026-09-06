import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sragData } from '../../data/srag';

const COLORS = { 'Masculino': '#22d3ee', 'Feminino': '#f472b6' };

const Item8BoxPlot = () => {
  const { t } = useTranslation();
  const data = sragData.boxPlotData;

  const globalMax = useMemo(() => {
    let mx = 0;
    for (const d of data) {
      const allVals = [d.min, d.q1, d.median, d.q3, d.max, ...d.outliers];
      for (const v of allVals) if (v > mx) mx = v;
    }
    return mx || 100;
  }, [data]);

  const W = 600;
  const H = 300;
  const pad = { top: 30, right: 40, bottom: 50, left: 80 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const boxWidth = 60;
  const gap = 80;

  const scaleX = (v: number) => pad.left + (v / globalMax) * plotW;
  const groupWidth = boxWidth + gap;
  const totalWidth = data.length * groupWidth;
  const offsetX = pad.left + (plotW - totalWidth) / 2 + groupWidth / 2;

  return (
    <motion.div
      className="item-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="item-subtitle">{t('items.item8.subtitle')}</div>
      <div className="item-header">
        <div className="item-number">8</div>
        <h3 className="item-title">{t('items.item8.title')}</h3>
      </div>
      <p className="item-description">{t('items.item8.description')}</p>

      <div className="item-content boxplot-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="boxplot-svg">
          {/* Y axis grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const val = globalMax * frac;
            const x = scaleX(val);
            return (
              <g key={frac}>
                <line x1={x} y1={pad.top} x2={x} y2={pad.top + plotH} stroke="var(--grid-line)" strokeWidth="1" />
                <text x={x} y={H - pad.bottom + 16} fill="var(--text-secondary)" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* X axis */}
          <line x1={pad.left} y1={pad.top + plotH} x2={W - pad.right} y2={pad.top + plotH} stroke="var(--grid-line-bold)" strokeWidth="1" />
          <text x={W / 2} y={H - 5} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontWeight="600">
            Idade (anos)
          </text>

          {/* Box plots */}
          {data.map((d, i) => {
            const cx = offsetX + i * groupWidth;
            const color = COLORS[d.label as keyof typeof COLORS] || 'var(--accent-color)';
            const toY = (v: number) => pad.top + plotH - (v / globalMax) * plotH;

            const yMin = toY(d.min);
            const yQ1 = toY(d.q1);
            const yMedian = toY(d.median);
            const yQ3 = toY(d.q3);
            const yMax = toY(d.max);

            return (
              <g key={d.label}>
                {/* Whiskers */}
                <line x1={cx} y1={yMin} x2={cx} y2={yQ1} stroke={color} strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1={cx} y1={yQ3} x2={cx} y2={yMax} stroke={color} strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Min/Max caps */}
                <line x1={cx - boxWidth / 4} y1={yMin} x2={cx + boxWidth / 4} y2={yMin} stroke={color} strokeWidth="1.5" />
                <line x1={cx - boxWidth / 4} y1={yMax} x2={cx + boxWidth / 4} y2={yMax} stroke={color} strokeWidth="1.5" />

                {/* Box (Q1 to Q3) */}
                <motion.rect
                  x={cx - boxWidth / 2}
                  y={yQ3}
                  width={boxWidth}
                  height={yQ1 - yQ3}
                  fill={color}
                  fillOpacity="0.2"
                  stroke={color}
                  strokeWidth="1.5"
                  rx="3"
                  initial={{ height: 0, y: yQ1 }}
                  whileInView={{ height: yQ1 - yQ3, y: yQ3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />

                {/* Median line */}
                <motion.line
                  x1={cx - boxWidth / 2}
                  y1={yMedian}
                  x2={cx + boxWidth / 2}
                  y2={yMedian}
                  stroke="#fff"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                />

                {/* Outliers */}
                {d.outliers.map((o, j) => (
                  <circle key={j} cx={cx} cy={toY(o)} r="3" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
                ))}

                {/* Label */}
                <text x={cx} y={pad.top + plotH + 30} fill={color} fontSize="11" textAnchor="middle" fontWeight="700">
                  {d.label}
                </text>
                <text x={cx} y={pad.top + plotH + 42} fill="var(--text-secondary)" fontSize="8" textAnchor="middle">
                  n={d.count.toLocaleString('pt-BR')}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="answer-card">
          <div className="answer-label">{t('items.answer')}</div>
          <p className="answer-text">
            {data.map((d) =>
              `${d.label}: mediana=${d.median}, IQR=${(d.q3 - d.q1).toFixed(1)}, outliers=${d.outliers.length}`
            ).join(' · ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Item8BoxPlot;
