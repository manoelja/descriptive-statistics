export interface ReportSection {
  title: string;
  items: string[];
}

export interface ReportData {
  title: string;
  subtitle: string;
  description: string;
  sections: ReportSection[];
}

export const reportData: Record<string, ReportData> = {
  pt: {
    title: 'Relatório do Projeto',
    subtitle: 'Estatística Descritiva — SRAG 2026',
    description: 'Análise descritiva de 170.328 notificações de Síndrome Respiratória Aguda Grave (SRAG) do ano de 2026, com dados do SIVEP-Gripe (Ministério da Saúde). O projeto transforma dados brutos em visualizações interativas para fins acadêmicos.',
    sections: [
      {
        title: 'Stack Tecnológica',
        items: [
          'React 19 + TypeScript + Vite 8',
          'Framer Motion para animações',
          'i18next para suporte multilíngue (PT/EN/ES)',
          'Vitest para testes automatizados',
          'Recharts para visualização de dados',
        ],
      },
      {
        title: 'Variáveis Analisadas',
        items: [
          'CS_SEXO — Sexo do paciente',
          'NU_IDADE_N — Idade do paciente',
          'CS_RACA — Raça/Cor',
          'VACINA — Status de vacinação',
          'UTI — Internação em UTI',
          'CLASSI_FIN — Classificação final do caso',
          'EVOLUCAO — Evolução do caso',
        ],
      },
      {
        title: 'Itens Estatísticos',
        items: [
          'Item 1 — Frequências de Sexo (CS_SEXO)',
          'Item 2 — Frequências de Raça/Cor (CS_RACA)',
          'Item 3 — Gráfico de Classificação Final (CLASSI_FIN)',
          'Item 4 — Histograma de Idade (NU_IDADE_N)',
          'Item 5 — Medidas-resumo da Idade',
          'Item 6 — Moda de Evolução (EVOLUCAO)',
          'Item 7 — Tabela Cruzada Vacina × UTI',
          'Item 8 — Box-Plot Idade × Sexo',
        ],
      },
      {
        title: 'Resultados Principais',
        items: [
          '170.328 notificações válidas de SRAG em 2026',
          'Pipeline de processamento: CSV → Node.js → React',
          'Dashboard interativo com filtros dinâmicos',
          'Laboratório de fórmulas de estatística descritiva',
          'Download de relatórios em PDF e PNG',
        ],
      },
    ],
  },
  en: {
    title: 'Project Report',
    subtitle: 'Descriptive Statistics — SRAG 2026',
    description: 'Descriptive analysis of 170,328 Severe Acute Respiratory Syndrome (SARS) notifications from 2026, with data from SIVEP-Flu (Ministry of Health). The project transforms raw data into interactive visualizations for academic purposes.',
    sections: [
      {
        title: 'Tech Stack',
        items: [
          'React 19 + TypeScript + Vite 8',
          'Framer Motion for animations',
          'i18next for multilingual support (PT/EN/ES)',
          'Vitest for automated testing',
          'Recharts for data visualization',
        ],
      },
      {
        title: 'Analyzed Variables',
        items: [
          'CS_SEXO — Patient sex',
          'NU_IDADE_N — Patient age',
          'CS_RACA — Race/Color',
          'VACINA — Vaccination status',
          'UTI — ICU admission',
          'CLASSI_FIN — Final case classification',
          'EVOLUCAO — Case outcome',
        ],
      },
      {
        title: 'Statistical Items',
        items: [
          'Item 1 — Sex Frequencies (CS_SEXO)',
          'Item 2 — Race/Color Frequencies (CS_RACA)',
          'Item 3 — Final Classification Chart (CLASSI_FIN)',
          'Item 4 — Age Histogram (NU_IDADE_N)',
          'Item 5 — Age Summary Measures',
          'Item 6 — Outcome Mode (EVOLUCAO)',
          'Item 7 — Cross-tabulation Vaccine × ICU',
          'Item 8 — Box-Plot Age × Sex',
        ],
      },
      {
        title: 'Key Results',
        items: [
          '170,328 valid SRAG notifications in 2026',
          'Processing pipeline: CSV → Node.js → React',
          'Interactive dashboard with dynamic filters',
          'Descriptive statistics formula laboratory',
          'Report download in PDF and PNG',
        ],
      },
    ],
  },
  es: {
    title: 'Informe del Proyecto',
    subtitle: 'Estadística Descriptiva — SRAG 2026',
    description: 'Análisis descriptivo de 170.328 notificaciones de Síndrome Respiratoria Aguda Grave (SRAG) del año 2026, con datos del SIVEP-Gripe (Ministerio de Salud). El proyecto transforma datos brutos en visualizaciones interactivas con fines académicos.',
    sections: [
      {
        title: 'Stack Tecnológico',
        items: [
          'React 19 + TypeScript + Vite 8',
          'Framer Motion para animaciones',
          'i18next para soporte multilingüe (PT/EN/ES)',
          'Vitest para pruebas automatizadas',
          'Recharts para visualización de datos',
        ],
      },
      {
        title: 'Variables Analizadas',
        items: [
          'CS_SEXO — Sexo del paciente',
          'NU_IDADE_N — Edad del paciente',
          'CS_RACA — Raza/Color',
          'VACINA — Estado de vacunación',
          'UTI — Internación en UCI',
          'CLASSI_FIN — Clasificación final del caso',
          'EVOLUCAO — Evolución del caso',
        ],
      },
      {
        title: 'Ítems Estadísticos',
        items: [
          'Ítem 1 — Frecuencias de Sexo (CS_SEXO)',
          'Ítem 2 — Frecuencias de Raza/Color (CS_RACA)',
          'Ítem 3 — Gráfico de Clasificación Final (CLASSI_FIN)',
          'Ítem 4 — Histograma de Edad (NU_IDADE_N)',
          'Ítem 5 — Medidas resumen de Edad',
          'Ítem 6 — Moda de Evolución (EVOLUCAO)',
          'Ítem 7 — Tabla cruzada Vacuna × UCI',
          'Ítem 8 — Box-Plot Edad × Sexo',
        ],
      },
      {
        title: 'Resultados Principales',
        items: [
          '170.328 notificaciones válidas de SRAG en 2026',
          'Pipeline de procesamiento: CSV → Node.js → React',
          'Panel interactivo con filtros dinámicos',
          'Laboratorio de fórmulas de estadística descriptiva',
          'Descarga de informes en PDF y PNG',
        ],
      },
    ],
  },
};
