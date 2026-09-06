import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sragData } from '../../data/srag';

const Item5ResumoIdade = () => {
  const { t } = useTranslation();
  const s = sragData.idadeSummary;

  const stats = [
    { label: 'Média', value: s.mean.toFixed(2) },
    { label: 'Mediana', value: s.median.toFixed(2) },
    { label: 'Mínimo', value: String(s.min) },
    { label: 'Máximo', value: String(s.max) },
    { label: 'Q1 (25%)', value: s.q1.toFixed(2) },
    { label: 'Q3 (75%)', value: s.q3.toFixed(2) },
    { label: 'Desvio Padrão', value: s.stdDev.toFixed(2) },
    { label: 'CV (%)', value: s.cv.toFixed(2) + '%' },
  ];

  return (
    <motion.div
      className="item-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="item-subtitle">{t('items.item5.subtitle')}</div>
      <div className="item-header">
        <div className="item-number">5</div>
        <h3 className="item-title">{t('items.item5.title')}</h3>
      </div>
      <p className="item-description">{t('items.item5.description')}</p>

      <div className="item-content">
        <div className="stat-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="answer-card">
          <div className="answer-label">{t('items.answer')}</div>
          <p className="answer-text">
            Média: {s.mean.toFixed(2)} · Mediana: {s.median.toFixed(2)} · DP: {s.stdDev.toFixed(2)} · CV: {s.cv.toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Item5ResumoIdade;
