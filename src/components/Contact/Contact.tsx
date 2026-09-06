import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, User, X, Database, FileText } from 'lucide-react';
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
  pt: 'Sou Manoel, Data Scientist. Acredito que dados bem contados geram impacto: transformo bases públicas em histórias visuais e ferramentas acessíveis. Este dashboard de SRAG 2026 foi construído do zero — da leitura do CSV em Node.js ao pipeline de processamento estatático e à interface interativa em React. Cada uma das 170.328 notificações foi analisada em 8 itens de estatística descritiva, desde tabelas de frequência até box-plots comparativos.',
  en: "I'm Manoel, a Data Scientist. I believe well-told data creates impact: I turn public datasets into visual stories and accessible tools. This SRAG 2026 dashboard was built from scratch — from reading the CSV in Node.js to the statistical processing pipeline and the interactive React interface. Each of the 170,328 notifications was analyzed in 8 descriptive statistics items, from frequency tables to comparative box-plots.",
  es: 'Soy Manoel, Data Scientist. Creo que los datos bien contados generan impacto: transformo bases públicas en historias visuales y herramientas accesibles. Este panel de SRAG 2026 fue construido desde cero — desde la lectura del CSV en Node.js hasta el pipeline de procesamiento estadístico y la interfaz interactiva en React. Cada una de las 170.328 notificaciones fue analizada en 8 ítems de estadística descriptiva, desde tablas de frecuencia hasta box-plots comparativos.',
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

            <div className="footer-data-links">
              <a
                href="https://dadosabertos.saude.gov.br/dataset/srag-2019-a-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="data-link"
                title="Portal de Dados Abertos do SUS"
              >
                <Database size={20} />
              </a>
              <a
                href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/sivep-gripe"
                target="_blank"
                rel="noopener noreferrer"
                className="data-link"
                title="Documentação SIVEP-Gripe"
              >
                <FileText size={20} />
              </a>
            </div>

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
