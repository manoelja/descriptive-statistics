import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <h2 className="section-title">{t('footer.title')}</h2>
        <p className="footer-desc">{t('footer.description')}</p>
        <div className="footer-bottom">
          <span>SRAG 2026 · Ministério da Saúde · SIVEP-Gripe</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
