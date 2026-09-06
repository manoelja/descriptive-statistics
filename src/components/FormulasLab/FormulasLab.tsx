import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Beaker } from 'lucide-react';
import { formulas } from './formulaData';
import FormulaCard from './FormulaCard';
import './FormulasLab.css';

const FormulasLab = () => {
  const { t } = useTranslation();

  return (
    <section id="formulas" className="formulas-section">
      <div className="container">
        <motion.div
          className="formulas-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="formulas-badge">
            <Beaker size={14} />
            {t('formulas.badge')}
          </div>
          <h2 className="formulas-title">{t('formulas.title')}</h2>
          <p className="formulas-subtitle">{t('formulas.subtitle')}</p>
        </motion.div>

        <div className="formulas-grid">
          {formulas.map((f) => (
            <div key={f.id} className="formula-card-wrapper">
              <FormulaCard formula={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FormulasLab;
