import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sragData } from '../../data/srag';

const COLORS: Record<string, string> = {
  'Branca': '#60a5fa',
  'Preta': '#a78bfa',
  'Amarela': '#fbbf24',
  'Parda': '#f97316',
  'Indígena': '#34d399',
  'Ignorado': '#a1a1aa',
};

const Item2Raca = () => {
  const { t } = useTranslation();
  const freq = sragData.racaFreq;
  const maxCount = Math.max(...freq.map((f) => f.count), 1);

  return (
    <motion.div
      className="item-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="item-subtitle">{t('items.item2.subtitle')}</div>
      <div className="item-header">
        <div className="item-number">2</div>
        <h3 className="item-title">{t('items.item2.title')}</h3>
      </div>
      <p className="item-description">{t('items.item2.description')}</p>

      <div className="item-content">
        <table className="freq-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>{t('items.absolute')}</th>
              <th>{t('items.proportion')}</th>
            </tr>
          </thead>
          <tbody>
            {freq.map((row) => (
              <tr key={row.category} className={row.label === sragData.racaTopCategory ? 'highlight-row' : ''}>
                <td>{row.label}</td>
                <td>{row.count.toLocaleString('pt-BR')}</td>
                <td>{row.percentage.toFixed(4)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '1.5rem' }}>
          {freq.filter((f) => f.category !== '9').map((row) => (
            <div key={row.category} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
              <span style={{ width: 100, fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>{row.label}</span>
              <div style={{ flex: 1, height: 20, background: 'var(--accent-soft)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: COLORS[row.category] || 'var(--accent-color)', borderRadius: 4 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(row.count / maxCount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span style={{ width: 90, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {row.percentage.toFixed(4)}%
              </span>
            </div>
          ))}
        </div>

        <div className="answer-card">
          <div className="answer-label">{t('items.answer')}</div>
          <p className="answer-text">
            {t('items.item2.title')}: {sragData.racaTopCategory} ({sragData.racaTopProportion.toFixed(4)}%)
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Item2Raca;
