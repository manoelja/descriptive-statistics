import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sragData } from '../../data/srag';
import './Items.css';

interface ItemDef {
  id: number;
  category: Record<string, string>;
  title: Record<string, string>;
  description: Record<string, string>;
  problem: Record<string, string>;
  result: Record<string, string>;
  tags: string[];
}

const items: ItemDef[] = [
  {
    id: 1,
    category: { pt: 'Frequência', en: 'Frequency', es: 'Frecuencia' },
    title: { pt: 'Item 1 — Sexo', en: 'Item 1 — Sex', es: 'Ítem 1 — Sexo' },
    description: {
      pt: 'Tabela de frequências da variável sexo CS_SEXO.',
      en: 'Frequency table for the sex variable CS_SEXO.',
      es: 'Tabla de frecuencias de la variable sexo CS_SEXO.',
    },
    problem: {
      pt: 'Qual a porcentagem de notificações são do sexo feminino e masculino?',
      en: 'What percentage of notifications are female and male?',
      es: '¿Qué porcentaje de notificaciones son femeninas y masculinas?',
    },
    result: {
      pt: `Masculino: ${sragData.sexoFreq.find(f => f.label === 'Masculino')?.percentage}% | Feminino: ${sragData.sexoFreq.find(f => f.label === 'Feminino')?.percentage}%`,
      en: `Male: ${sragData.sexoFreq.find(f => f.label === 'Masculino')?.percentage}% | Female: ${sragData.sexoFreq.find(f => f.label === 'Feminino')?.percentage}%`,
      es: `Masculino: ${sragData.sexoFreq.find(f => f.label === 'Masculino')?.percentage}% | Femenino: ${sragData.sexoFreq.find(f => f.label === 'Feminino')?.percentage}%`,
    },
    tags: ['CS_SEXO', 'Tabela', 'Frequência'],
  },
  {
    id: 2,
    category: { pt: 'Frequência', en: 'Frequency', es: 'Frecuencia' },
    title: { pt: 'Item 2 — Raça/Cor', en: 'Item 2 — Race/Color', es: 'Ítem 2 — Raza/Color' },
    description: {
      pt: 'Frequências da variável CS_RACA por categoria.',
      en: 'Frequencies of the CS_RACA variable by category.',
      es: 'Frecuencias de la variable CS_RACA por categoría.',
    },
    problem: {
      pt: 'Qual a categoria de raça/cor com a maior proporção de notificações?',
      en: 'Which race/color category has the highest proportion of notifications?',
      es: '¿Qué categoría de raza/color tiene la mayor proporción de notificaciones?',
    },
    result: {
      pt: `${sragData.racaTopCategory} (${sragData.racaTopProportion}%)`,
      en: `${sragData.racaTopCategory} (${sragData.racaTopProportion}%)`,
      es: `${sragData.racaTopCategory} (${sragData.racaTopProportion}%)`,
    },
    tags: ['CS_RACA', 'Tabela', 'Proporção'],
  },
  {
    id: 3,
    category: { pt: 'Gráfico', en: 'Chart', es: 'Gráfico' },
    title: { pt: 'Item 3 — Classificação', en: 'Item 3 — Classification', es: 'Ítem 3 — Clasificación' },
    description: {
      pt: 'Gráfico em barras da classificação final do caso CLASSI_FIN.',
      en: 'Bar chart of the final case classification CLASSI_FIN.',
      es: 'Gráfico de barras de la clasificación final del caso CLASSI_FIN.',
    },
    problem: {
      pt: 'Qual é a classificação mais frequente?',
      en: 'Which is the most frequent classification?',
      es: '¿Cuál es la clasificación más frecuente?',
    },
    result: { pt: sragData.classificacaoTop, en: sragData.classificacaoTop, es: sragData.classificacaoTop },
    tags: ['CLASSI_FIN', 'Barras', 'Gráfico'],
  },
  {
    id: 4,
    category: { pt: 'Histograma', en: 'Histogram', es: 'Histograma' },
    title: { pt: 'Item 4 — Idade', en: 'Item 4 — Age', es: 'Ítem 4 — Edad' },
    description: {
      pt: 'Histograma de NU_IDADE_N com amplitude 10 e densidade de frequência.',
      en: 'Histogram of NU_IDADE_N with amplitude 10 and frequency density.',
      es: 'Histograma de NU_IDADE_N con amplitud 10 y densidad de frecuencia.',
    },
    problem: {
      pt: 'Qual a faixa etária mais frequente?',
      en: 'Which age range is most frequent?',
      es: '¿Qué rango de edad es más frecuente?',
    },
    result: { pt: sragData.idadeTopBin, en: sragData.idadeTopBin, es: sragData.idadeTopBin },
    tags: ['NU_IDADE_N', 'Histograma', 'Densidade'],
  },
  {
    id: 5,
    category: { pt: 'Medidas', en: 'Measures', es: 'Medidas' },
    title: { pt: 'Item 5 — Resumo Idade', en: 'Item 5 — Age Summary', es: 'Ítem 5 — Resumen Edad' },
    description: {
      pt: 'Medidas-resumo da variável idade: média, mediana, desvio padrão, quartis.',
      en: 'Summary measures for age: mean, median, standard deviation, quartiles.',
      es: 'Medidas resumen de la edad: media, mediana, desviación estándar, cuartiles.',
    },
    problem: {
      pt: 'Quais são as medidas-resumo da idade das notificações?',
      en: 'What are the summary measures of notification age?',
      es: '¿Cuáles son las medidas resumen de la edad de las notificaciones?',
    },
    result: {
      pt: `Média: ${sragData.idadeSummary.mean} | Mediana: ${sragData.idadeSummary.median} | DP: ${sragData.idadeSummary.stdDev}`,
      en: `Mean: ${sragData.idadeSummary.mean} | Median: ${sragData.idadeSummary.median} | SD: ${sragData.idadeSummary.stdDev}`,
      es: `Media: ${sragData.idadeSummary.mean} | Mediana: ${sragData.idadeSummary.median} | DE: ${sragData.idadeSummary.stdDev}`,
    },
    tags: ['NU_IDADE_N', 'Média', 'Mediana', 'DP'],
  },
  {
    id: 6,
    category: { pt: 'Moda', en: 'Mode', es: 'Moda' },
    title: { pt: 'Item 6 — Evolução', en: 'Item 6 — Evolution', es: 'Ítem 6 — Evolución' },
    description: {
      pt: 'Moda da variável EVOLUCAO — evolução mais frequente do caso.',
      en: 'Mode of the EVOLUCAO variable — most frequent case evolution.',
      es: 'Moda de la variable EVOLUCAO — evolución más frecuente del caso.',
    },
    problem: {
      pt: 'Qual foi a evolução mais frequente registrada?',
      en: 'What was the most frequent evolution recorded?',
      es: '¿Cuál fue la evolución más frecuente registrada?',
    },
    result: {
      pt: `${sragData.evolucaoModa} (${sragData.evolucaoModaCount.toLocaleString('pt-BR')} casos)`,
      en: `${sragData.evolucaoModa} (${sragData.evolucaoModaCount.toLocaleString('pt-BR')} cases)`,
      es: `${sragData.evolucaoModa} (${sragData.evolucaoModaCount.toLocaleString('pt-BR')} casos)`,
    },
    tags: ['EVOLUCAO', 'Moda', 'Frequência'],
  },
  {
    id: 7,
    category: { pt: 'Cruzada', en: 'Cross-tab', es: 'Cruzada' },
    title: { pt: 'Item 7 — Vacina × UTI', en: 'Item 7 — Vaccine × ICU', es: 'Ítem 7 — Vacuna × UCI' },
    description: {
      pt: 'Tabela cruzada VACINA × UTI com frequências relativas pela linha.',
      en: 'Cross-tabulation VACINA × UTI with relative frequencies by row.',
      es: 'Tabla cruzada VACINA × UTI con frecuencias relativas por fila.',
    },
    problem: {
      pt: 'Qual a % de vacinados e não vacinados internados em UTI?',
      en: 'What % of vaccinated and unvaccinated were hospitalized in ICU?',
      es: '¿Qué % de vacunados y no vacunados fueron hospitalizados en UCI?',
    },
    result: {
      pt: `Vacinados UTI: ${sragData.vacinaSimUTI}% | Não vacinados UTI: ${sragData.vacinaNaoUTI}%`,
      en: `Vaccinated ICU: ${sragData.vacinaSimUTI}% | Unvaccinated ICU: ${sragData.vacinaNaoUTI}%`,
      es: `Vacunados UCI: ${sragData.vacinaSimUTI}% | No vacunados UCI: ${sragData.vacinaNaoUTI}%`,
    },
    tags: ['VACINA', 'UTI', 'Cruzada', 'Proporção'],
  },
  {
    id: 8,
    category: { pt: 'Box-Plot', en: 'Box-Plot', es: 'Box-Plot' },
    title: { pt: 'Item 8 — Idade × Sexo', en: 'Item 8 — Age × Sex', es: 'Ítem 8 — Edad × Sexo' },
    description: {
      pt: 'Box-plot comparativo da idade por sexo com quartis e outliers.',
      en: 'Comparative box-plot of age by sex with quartiles and outliers.',
      es: 'Box-plot comparativo de la edad por sexo con cuartiles y valores atípicos.',
    },
    problem: {
      pt: 'Como se distribui a idade por sexo? Qual a mediana e dispersão?',
      en: 'How is age distributed by sex? What is the median and dispersion?',
      es: '¿Cómo se distribuye la edad por sexo? ¿Cuál es la mediana y dispersión?',
    },
    result: {
      pt: `Masculino: med=${sragData.boxPlotData[0]?.median} | Feminino: med=${sragData.boxPlotData[1]?.median}`,
      en: `Male: med=${sragData.boxPlotData[0]?.median} | Female: med=${sragData.boxPlotData[1]?.median}`,
      es: `Masculino: med=${sragData.boxPlotData[0]?.median} | Femenino: med=${sragData.boxPlotData[1]?.median}`,
    },
    tags: ['NU_IDADE_N', 'CS_SEXO', 'Box-Plot', 'Quartis'],
  },
];

const Items = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] as 'pt' | 'en' | 'es';
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="items" className="items-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('items.title')}
        </motion.h2>

        <motion.div
          className="items-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <motion.div
                key={item.id}
                className={`item-card cyber-card ${isExpanded ? 'expanded' : ''}`}
                variants={itemVariants}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="item-content-wrapper">
                  <AnimatePresence mode="wait">
                    {isExpanded ? (
                      <motion.div
                        key="details"
                        className="item-card-inner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="item-card-header">
                          <span className="item-category">
                            {item.category[lang] || item.category['pt']}
                          </span>
                        </div>
                        <h3 className="item-card-title-expanded">
                          {item.title[lang] || item.title['pt']}
                        </h3>
                        <div className="item-details">
                          <div className="detail-item">
                            <strong>{t('items.question')}:</strong> {item.problem[lang] || item.problem['pt']}
                          </div>
                          <div className="detail-item result">
                            <strong>{t('items.answer')}:</strong> {item.result[lang] || item.result['pt']}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        className="item-card-inner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="item-card-header">
                          <span className="item-category">
                            {item.category[lang] || item.category['pt']}
                          </span>
                        </div>
                        <h3 className="item-card-title">
                          {item.title[lang] || item.title['pt']}
                        </h3>
                        <p className="item-card-desc">
                          {item.description[lang] || item.description['pt']}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="item-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="item-tag">{tag}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Items;
