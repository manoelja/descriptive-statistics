import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Database, FileText, BarChart3, Shield, ChevronDown, Activity, AlertCircle } from 'lucide-react';
import type { DocInfo } from './DocumentPreviewModal';
import { reportData } from '../../data/reportData';
import './About.css';

interface AboutProps {
  setPreviewDoc: (doc: DocInfo | null) => void;
}

const About = ({ setPreviewDoc }: AboutProps) => {
  const { t, i18n } = useTranslation();
  const [isDataExpanded, setIsDataExpanded] = useState(false);
  const [isMissionExpanded, setIsMissionExpanded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const lang = i18n.language.split('-')[0] as 'pt' | 'en' | 'es';
  const report = reportData[lang] || reportData.pt;

  const technicalDocs: DocInfo[] = [
    {
      name: t('about.docs_ref_name'),
      slug: 'Referencia_Tecnica',
      subtitle: report.subtitle,
      description: report.description,
      summary: report.sections.map((section) => ({
        heading: section.title,
        items: section.items
      }))
    },
    {
      name: t('about.docs_ml_name'),
      slug: 'Plano_ML',
      summary: t('about.docs_ml_summary', { returnObjects: true }) as DocInfo['summary']
    }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('about.title')}
        </motion.h2>

        <motion.div
          className="about-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="about-info" variants={itemVariants}>
            <div
              className="about-card-main cyber-card"
              onClick={() => setIsDataExpanded(!isDataExpanded)}
              style={{ cursor: 'pointer' }}
            >
              <div className="about-card-header">
                <div className="about-card-header-label">
                  <Database size={20} color="var(--accent-color)" />
                  <span className="card-label">{t('about.data_report')}</span>
                </div>
                <motion.div
                  animate={{ rotate: isDataExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} opacity={0.5} />
                </motion.div>
              </div>

              <div className="about-content-wrapper">
                <AnimatePresence mode="wait">
                  {!isDataExpanded ? (
                    <motion.div
                      key="preview"
                      className="about-preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <p className="about-description-text">
                        {t('about.preview_text')}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      className="about-details-expanded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="profile-deep-dive">
                        <p className="deep-text">
                          <span style={{ color: 'var(--accent-color)' }}>&gt;</span> {t('about.detailed_profile')}
                        </p>

                        <div className="mission-box">
                          <div className="mission-header">
                            <FileText size={16} color="var(--accent-color)" />
                            <span className="card-label">{t('about.mission_objective')}</span>
                          </div>
                          <p className="mission-body">{t('about.mission_text')}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="about-details-list">
                <div className="detail-item-modern">
                  <BarChart3 size={16} color="var(--accent-color)" />
                  <div className="detail-info-wrap">
                    <span className="detail-label">{t('about.initial')}</span>
                    <span className="detail-value">170.328 {t('about.records')}</span>
                  </div>
                </div>
                <div className="detail-item-modern">
                  <Activity size={16} color="var(--accent-color)" />
                  <div className="detail-info-wrap">
                    <span className="detail-label">8</span>
                    <span className="detail-value">ITENS</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="about-doc-buttons"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {technicalDocs.map((doc) => (
                <button
                  key={doc.slug}
                  type="button"
                  className="doc-preview-btn"
                  onClick={() => setPreviewDoc(doc)}
                >
                  <FileText size={20} />
                  <span>{doc.name}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="about-education" variants={itemVariants}>
            <div
              className="edu-card-modern cyber-card"
              onClick={() => setIsMissionExpanded(!isMissionExpanded)}
              style={{ cursor: 'pointer' }}
            >
              <div className="edu-header-row">
                <div className="edu-icon-container">
                  <Shield size={24} />
                </div>
                <div className="edu-content">
                  <span className="edu-type">{t('about.mission_objective')}</span>
                  <h3 className="edu-title">{t('about.mission_title')}</h3>
                </div>
                <motion.div
                  animate={{ rotate: isMissionExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} opacity={0.5} />
                </motion.div>
              </div>

              <div className="edu-content-wrapper">
                <AnimatePresence mode="wait">
                  {isMissionExpanded ? (
                    <motion.div
                      key="detail"
                      className="edu-details-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="edu-institution">
                        <span className="inst-name">7 VARIÁVEIS</span>
                        <span className="inst-full">CS_SEXO, NU_IDADE_N, CS_RACA, VACINA, UTI, CLASSI_FIN, EVOLUCAO</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      className="edu-badge"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      7 VARIÁVEIS
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="edu-card-modern cyber-card">
              <div className="edu-header-row">
                <div className="edu-icon-container">
                  <FileText size={24} />
                </div>
                <div className="edu-content">
                  <span className="edu-type">ESTATÍSTICA DESCRITIVA</span>
                  <h3 className="edu-title">8 ITENS DE ANÁLISE</h3>
                </div>
              </div>
              <div className="edu-content-wrapper">
                <div className="edu-badge">
                  TABELAS, HISTOGRAMAS, BOX-PLOTS
                </div>
              </div>
            </div>

            <div className="mission-box about-alert-box">
              <div className="about-alert-header">
                <AlertCircle size={14} />
                <span className="card-label">{t('about.pipeline_status')}</span>
              </div>
              <p className="about-alert-body">{t('about.pipeline_alert')}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;