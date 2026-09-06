import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sragData } from '../../data/srag';

const COLORS = ['#22d3ee', '#16a34a', '#fbbf24', '#a78bfa', '#f87171'];

const Item3Classificacao = () => {
  const { t } = useTranslation();
  const freq = sragData.classificacaoFreq;
  const maxCount = Math.max(...freq.map((f) => f.count), 1);

  return (
    <motion.div
      className="item-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="item-subtitle">{t('items.item3.subtitle')}</div>
      <div className="item-header">
        <div className="item-number">3</div>
        <h3 className="item-title">{t('items.item3.title')}</h3>
      </div>
      <p className="item-description">{t('items.item3.description')}</p>

      <div className="item-content">
        <div className="hbar-chart">
          {freq.map((row, i) => (
            <div key={row.category} className="hbar-row">
              <div className="hbar-label">{row.label}</div>
              <div className="hbar-track">
                <motion.div
                  className="hbar-fill"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(row.count / maxCount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                />
              </div>
              <div className="hbar-value">{(row.count / 100).toFixed(0)}00</div>
            </div>
          ))}
        </div>

        <div className="answer-card">
          <div className="answer-label">{t('items.answer')}</div>
          <p className="answer-text">
            {t('items.item3.title')}: {sragData.classificacaoTop}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Item3Classificacao;
