import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import type { FormulaDef } from './formulaData';
import MiniCalculator from './widgets/MiniCalculator';
import {
  FrequencyBar,
  MiniPie,
  RangeRuler,
  StdDevBars,
  CvIndicator,
} from './widgets/SvgWidgets';
import './FormulaCard.css';

const calcTypeMap: Record<string, 'frequency' | 'proportion' | 'mean' | 'median' | 'stddev' | 'range' | 'mode'> = {
  frequency: 'frequency',
  proportion: 'proportion',
  mode: 'mode',
  mean: 'mean',
  median: 'median',
  stddev: 'stddev',
  cv: 'stddev',
  range: 'range',
};

const FormulaCard = ({ formula }: { formula: FormulaDef }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const handleCardClick = () => {
    setExpanded((prev) => !prev);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderVisual = () => {
    switch (formula.id) {
      case 'frequency': return <FrequencyBar value={52.11} />;
      case 'proportion': return <MiniPie value={48.09} />;
      case 'mode': return <FrequencyBar value={71.56} color="var(--lavender)" />;
      case 'mean': return <FrequencyBar value={(26.44 / 115) * 100} />;
      case 'median': return <FrequencyBar value={(8 / 115) * 100} color="var(--lavender)" />;
      case 'stddev': return <StdDevBars mean={26.44} stddev={31.26} />;
      case 'cv': return <CvIndicator cv={118.2} />;
      case 'range': return <RangeRuler min={0} max={115} />;
      default: return null;
    }
  };

  return (
    <motion.div
      className={`formula-card cyber-card ${expanded ? 'expanded' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: formula.number * 0.08 }}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            className="formula-card-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="formula-card-header">
              <div className="formula-number">{formula.number}</div>
              <div className="formula-card-info">
                <h3 className="formula-title">{t(formula.titleKey)}</h3>
                <div className="formula-notation">{formula.formula}</div>
              </div>
            </div>

            <div className="formula-expanded-content">
              <div className="formula-legend" onClick={stopPropagation}>
                <span className="legend-label">{t('formulas.legend')}:</span>
                {Object.entries(formula.legend).map(([sym, transKey]) => (
                  <span key={sym} className="legend-item">
                    <strong>{sym}</strong> = {t(transKey)}
                  </span>
                ))}
              </div>

              <div className="formula-visual">{renderVisual()}</div>

              <div className="formula-srag-detail" onClick={stopPropagation}>
                <span className="srag-detail-label">{t('formulas.srag_result')}:</span>
                <span className="srag-detail-value">
                  {formula.formula.split('=')[0].trim()} = {formula.sragValue} ({formula.sragLabel})
                </span>
              </div>

              <div className="formula-calculator-section" onClick={stopPropagation}>
                <div className="calc-header">
                  <Calculator size={14} />
                  <span>{t('formulas.try_yourself')}</span>
                </div>
                <MiniCalculator type={calcTypeMap[formula.id]} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            className="formula-card-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="formula-card-header">
              <div className="formula-number">{formula.number}</div>
              <div className="formula-card-info">
                <h3 className="formula-title">{t(formula.titleKey)}</h3>
                <div className="formula-notation">{formula.formula}</div>
              </div>
              <div className="formula-card-right">
                <div className="formula-srag-badge">
                  <span className="srag-value">{formula.sragValue}</span>
                  <span className="srag-label">{formula.sragLabel}</span>
                </div>
              </div>
            </div>
            <div className="formula-visual">{renderVisual()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FormulaCard;
