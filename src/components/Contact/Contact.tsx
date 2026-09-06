import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, User, X } from 'lucide-react';
import Flowchart from './Flowchart';
import './Flowchart.css';
import './Contact.css';

const authorLabels: Record<string, string> = {
  pt: 'Desenvolvido por Manoel — Data Scientist',
  en: 'Developed by Manoel — Data Scientist',
  es: 'Desarrollado por Manoel — Data Scientist',
};

const aboutTitles: Record<string, string> = {
  pt: 'Sobre o Desenvolvedor',
  en: 'About the Developer',
  es: 'Sobre el Desarrollador',
};

const aboutTexts: Record<string, string> = {
  pt: 'Sou Manoel, Data Scientist. Construí este dashboard do zero — do processamento do CSV ao frontend em React. Analisei 170.328 notificações de SRAG em 8 itens de estatística descritiva.',
  en: "I'm Manoel, a Data Scientist. I built this dashboard from scratch — from CSV processing to the React frontend. I analyzed 170,328 SRAG notifications across 8 descriptive statistics items.",
  es: 'Soy Manoel, Data Scientist. Construí este panel desde cero — del procesamiento del CSV al frontend en React. Analicé 170.328 notificaciones de SRAG en 8 ítems de estadística descriptiva.',
};

const copyrightTexts: Record<string, string> = {
  pt: '© 2026 DS.Manoel. Todos os direitos reservados.',
  en: '© 2026 DS.Manoel. All rights reserved.',
  es: '© 2026 DS.Manoel. Todos los derechos reservados.',
};

const Contact = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] as 'pt' | 'en' | 'es';
  const [showAbout, setShowAbout] = useState(false);

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="footer-title">{t('footer.title')}</h2>
            <p className="footer-desc">{t('footer.description')}</p>

            <p className="footer-author-credit">{authorLabels[lang] || authorLabels['pt']}</p>

            <div className="footer-social-icons">
              <motion.a
                href="https://github.com/manoelja/descriptive-statistics"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                whileHover={{ scale: 1.1, backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent-color)' }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/manoelja"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                whileHover={{ scale: 1.1, backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent-color)' }}
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="https://manoelja.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                whileHover={{ scale: 1.1, backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent-color)' }}
              >
                <img src="/manoelja.svg" alt="Portfolio" width="20" height="20" />
              </motion.a>
              <motion.button
                className="social-icon-btn"
                onClick={() => setShowAbout(!showAbout)}
                whileHover={{ scale: 1.1, backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent-color)' }}
              >
                <User size={20} />
              </motion.button>
            </div>

            <AnimatePresence>
              {showAbout && (
                <motion.div
                  className="developer-about-card"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="developer-about-header">
                    <h4>{aboutTitles[lang] || aboutTitles['pt']}</h4>
                    <button className="close-about-btn" onClick={() => setShowAbout(false)}>
                      <X size={16} />
                    </button>
                  </div>
                  <p className="developer-about-text">
                    {aboutTexts[lang] || aboutTexts['pt']}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="footer-flowchart"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Flowchart />
          </motion.div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content container">
          <p className="footer-copyright-text">{copyrightTexts[lang] || copyrightTexts['pt']}</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
