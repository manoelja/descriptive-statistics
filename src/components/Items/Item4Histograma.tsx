import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sragData } from '../../data/srag';

const Item4Histograma = () => {
  const { t } = useTranslation();
  const bins = sragData.idadeHistogram;
  const maxDensity = Math.max(...bins.map((b) => b.density), 0.001);

  const W = 700;
  const H = 280;
  const pad = { top: 20, right: 20, bottom: 50, left: 60 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const barW = plotW / bins.length;

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = maxDensity / 4;
    for (let i = 0; i <= 4; i++) ticks.push(Math.round(step * i * 10000) / 10000);
    return ticks;
  }, [maxDensity]);

  return (
    <motion.div
      className="item-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="item-subtitle">{t('items.item4.subtitle')}</div>
      <div className="item-header">
        <div className="item-number">4</div>
        <h3 className="item-title">{t('items.item4.title')}</h3>
      </div>
      <p className="item-description">{t('items.item4.description')}</p>

      <div className="item-content histogram-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="histogram-svg">
          {/* Y axis grid lines */}
          {yTicks.map((tick, i) => {
            const y = pad.top + plotH - (tick / maxDensity) * plotH;
            return (
              <g key={i}>
                <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="var(--grid-line)" strokeWidth="1" />
                <text x={pad.left - 8} y={y + 4} fill="var(--text-secondary)" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {tick.toFixed(4)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {bins.map((bin, i) => {
            const x = pad.left + i * barW;
            const barH = (bin.density / maxDensity) * plotH;
            const y = pad.top + plotH - barH;
            return (
              <g key={i}>
                <motion.rect
                  x={x + 1}
                  y={y}
                  width={barW - 2}
                  height={barH}
                  fill="rgba(22, 163, 74, 0.6)"
                  stroke="rgba(22, 163, 74, 0.8)"
                  strokeWidth="0.5"
                  rx="2"
                  initial={{ height: 0, y: pad.top + plotH }}
                  whileInView={{ height: barH, y }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                />
                {/* X axis label */}
                {i % 2 === 0 && (
                  <text x={x + barW / 2} y={H - pad.bottom + 16} fill="var(--text-secondary)" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {bin.binStart}
                  </text>
                )}
              </g>
            );
          })}

          {/* X axis line */}
          <line x1={pad.left} y1={pad.top + plotH} x2={W - pad.right} y2={pad.top + plotH} stroke="var(--grid-line-bold)" strokeWidth="1" />

          {/* Axis labels */}
          <text x={W / 2} y={H - 5} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontWeight="600">
            Idade (anos)
          </text>
          <text x={15} y={H / 2} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontWeight="600" transform={`rotate(-90, 15, ${H / 2})`}>
            Densidade
          </text>
        </svg>

        <div className="answer-card">
          <div className="answer-label">{t('items.answer')}</div>
          <p className="answer-text">
            {t('items.item4.title')}: {sragData.idadeTopBin}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Item4Histograma;
