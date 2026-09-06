import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Skills.css';

const technologies = [
  {
    name: 'React',
    category: 'FRONTEND',
    description: { pt: 'Biblioteca para interfaces de usuario', en: 'Library for user interfaces', es: 'Biblioteca para interfaces de usuario' },
  },
  {
    name: 'TypeScript',
    category: 'LINGUAGEM',
    description: { pt: 'JavaScript com tipos estaticos', en: 'JavaScript with static types', es: 'JavaScript con tipos estaticos' },
  },
  {
    name: 'Vite',
    category: 'BUILD',
    description: { pt: 'Build rapido para projetos modernos', en: 'Fast build for modern projects', es: 'Build rapido para proyectos modernos' },
  },
  {
    name: 'Node.js',
    category: 'PIPELINE',
    description: { pt: 'Processamento do CSV e geracao de dados', en: 'CSV processing and data generation', es: 'Procesamiento del CSV y generacion de datos' },
  },
  {
    name: 'Framer Motion',
    category: 'ANIMACAO',
    description: { pt: 'Animacoes fluidas na interface', en: 'Smooth interface animations', es: 'Animaciones fluidas en la interfaz' },
  },
  {
    name: 'i18next',
    category: 'INTERNACIONALIZACAO',
    description: { pt: 'Suporte a 3 idiomas (PT/EN/ES)', en: 'Support for 3 languages (PT/EN/ES)', es: 'Soporte para 3 idiomas (PT/EN/ES)' },
  },
  {
    name: 'Vitest',
    category: 'TESTES',
    description: { pt: '15 testes automatizados de integridade', en: '15 automated integrity tests', es: '15 pruebas automatizadas de integridad' },
  },
  {
    name: 'Canvas 2D',
    category: 'ANIMACAO',
    description: { pt: 'Animacao de fundo Data Flow em canvas', en: 'Data Flow background animation on canvas', es: 'Animacion de fondo Data Flow en canvas' },
  },
  {
    name: 'ESLint',
    category: 'QUALIDADE',
    description: { pt: 'Linting e padronizacao de codigo', en: 'Linting and code standardization', es: 'Linting y estandarizacion de codigo' },
  },
];

const Skills = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] as 'pt' | 'en' | 'es';
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const toggleSkill = (name: string) => {
    setExpandedSkill(expandedSkill === name ? null : name);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section id="skills" className="skills">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('skills.title')}
        </motion.h2>

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {technologies.map((skill) => (
            <div
              key={skill.name}
              className="skill-badge cyber-card"
              onClick={() => toggleSkill(skill.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className="skill-content-wrapper">
                <AnimatePresence mode="wait">
                  {expandedSkill !== skill.name ? (
                    <motion.div
                      key="header"
                      className="skill-header"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="skill-main-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-category">{skill.category}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="detail"
                      className="skill-detail-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <span className="skill-name-detail">{skill.name}</span>
                      <p>{skill.description[lang]}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
