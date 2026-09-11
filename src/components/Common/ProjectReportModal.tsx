import { useEffect, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, FileText, Database, BarChart3, ClipboardCheck, Award } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { reportData } from '../../data/reportData';
import './ProjectReportModal.css';

interface ProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const A4_W = 794;

const normalizeLang = (lang: string): string => {
  const base = lang.split('-')[0].toLowerCase();
  return base in reportData ? base : 'pt';
};

const getAccentColor = (): string =>
  document.documentElement.classList.contains('light-theme') ? '#16a34a' : '#22c55e';

const getReportPDFStyles = (accentColor: string) => `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: white;
    color: #1a1a2e;
    -webkit-font-smoothing: antialiased;
    width: ${A4_W}px;
  }
  .report-pdf-container {
    width: ${A4_W}px;
    padding: 30px 40px;
    background: white;
  }
  .report-pdf-container .report-paper-header {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid ${accentColor};
  }
  .report-pdf-container .report-paper-title {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -1px;
    color: #1a1a2e;
    margin-bottom: 4px;
  }
  .report-pdf-container .report-paper-subtitle {
    font-size: 12px;
    font-weight: 700;
    color: ${accentColor};
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .report-pdf-container .report-paper-description {
    font-size: 11px;
    color: #475569;
    line-height: 1.7;
    margin-bottom: 24px;
    text-align: justify;
  }
  .report-pdf-container .report-section {
    margin-bottom: 20px;
  }
  .report-pdf-container .report-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 2px solid ${accentColor};
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  .report-pdf-container .report-section-header svg {
    width: 16px;
    height: 16px;
    color: ${accentColor};
  }
  .report-pdf-container .report-section-title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #1a1a2e;
  }
  .report-pdf-container .report-section-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .report-pdf-container .report-section-list li {
    font-size: 10px;
    color: #475569;
    line-height: 1.6;
    padding-left: 14px;
    position: relative;
    text-align: justify;
  }
  .report-pdf-container .report-section-list li::before {
    content: "▸";
    position: absolute;
    left: 0;
    color: ${accentColor};
    font-weight: bold;
  }
`;

const sectionIcons = [Database, ClipboardCheck, BarChart3, Award];

const ProjectReportModal = ({ isOpen, onClose }: ProjectReportModalProps) => {
  const { t, i18n } = useTranslation();
  const paperRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.scrollTo(0, 0);
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  const activeLang = normalizeLang(i18n.language);
  const reportFileName = `Relatorio_SRAG_2026_${activeLang}`;
  const currentReport = reportData[activeLang] || reportData.pt;

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!paperRef.current || isGenerating) return;

    setIsGenerating(true);

    try {
      const accentColor = getAccentColor();

      const container = document.createElement('div');
      container.className = 'report-pdf-container';
      container.innerHTML = paperRef.current.innerHTML;

      const style = document.createElement('style');
      style.textContent = getReportPDFStyles(accentColor);

      const wrapper = document.createElement('div');
      wrapper.appendChild(style);
      wrapper.appendChild(container);

      document.body.appendChild(wrapper);
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';

      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const pageW = 210;
      const pageH = 297;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const ratio = canvas.width / canvas.height;
      let w = pageW;
      let h = w / ratio;
      if (h > pageH) {
        h = pageH;
        w = h * ratio;
      }

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      pdf.addImage(imgData, 'JPEG', (pageW - w) / 2, (pageH - h) / 2, w, h);
      pdf.save(`${reportFileName}.pdf`);

      document.body.removeChild(wrapper);
    } catch {
      alert(t('report.download_error', 'Erro ao baixar o relatório. Tente novamente.'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className={`report-modal-portal${isGenerating ? ' generating' : ''}`}>
          <div
            className="report-modal-backdrop"
            onClick={onClose}
          />

          <div
            className="report-modal-container"
            role="dialog"
            aria-modal="true"
            aria-label={t('report.title')}
          >
            <div className="report-modal-header">
              <div className="header-left">
                <FileText size={18} />
                <h3>{t('report.title')}</h3>
                <span className="report-lang-tag">{activeLang.toUpperCase()}</span>
              </div>
              <div className="header-right">
                <button
                  type="button"
                  className="report-control-btn download-btn"
                  title={t('report.download')}
                  onClick={handleDownload}
                >
                  <Download size={18} />
                  <span>{t('report.download')}</span>
                </button>
                <button
                  className="report-control-btn close-btn"
                  onClick={onClose}
                  aria-label={t('report.close')}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className={`report-modal-body${isGenerating ? ' generating' : ''}`}>
              <div className="report-paper" ref={paperRef}>
                <div className="report-paper-header">
                  <div className="report-paper-title">{currentReport.title}</div>
                  <div className="report-paper-subtitle">{currentReport.subtitle}</div>
                </div>

                <p className="report-paper-description">{currentReport.description}</p>

                <div className="report-sections">
                  {currentReport.sections.map((section, idx) => {
                    const Icon = sectionIcons[idx % sectionIcons.length];
                    return (
                      <div className="report-section" key={idx}>
                        <div className="report-section-header">
                          <Icon size={16} />
                          <h4 className="report-section-title">{section.title}</h4>
                        </div>
                        <ul className="report-section-list">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpen && isGenerating && (
        <div className="report-fullscreen-loading">
          <div className="report-loading-spinner">
            <div className="report-spinner-ring"></div>
            <span className="report-loading-text">{t('report.generating')}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectReportModal;
