/**
 * scripts/export-data.mjs
 *
 * Lê INFLUD26-20-07-2026.csv (SRAG 2026 — SIVEP-Gripe),
 * calcula todas as respostas da atividade e gera src/data/srag.ts.
 *
 * Uso: npm run data:export
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CSV_PATH = join(ROOT, 'INFLUD26-20-07-2026.csv');
const OUT_PATH = join(ROOT, 'src', 'data', 'srag.ts');

// ── 1. Leitura do CSV (delimitador ;) ────────────────────────────────────────
console.log('Lendo CSV...');
const raw = readFileSync(CSV_PATH, 'utf-8');
const lines = raw.split('\n').filter((l) => l.trim() !== '');

// Parse header
const headerLine = lines[0];
const headers = headerLine.split(';').map((h) => h.replace(/"/g, '').trim());

// Column indices we need
const COL = {
  CS_SEXO: headers.indexOf('CS_SEXO'),
  NU_IDADE_N: headers.indexOf('NU_IDADE_N'),
  CS_RACA: headers.indexOf('CS_RACA'),
  VACINA: headers.indexOf('VACINA'),
  UTI: headers.indexOf('UTI'),
  CLASSI_FIN: headers.indexOf('CLASSI_FIN'),
  EVOLUCAO: headers.indexOf('EVOLUCAO'),
};

console.log('Colunas encontradas:', COL);

// Parse data rows
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const vals = lines[i].split(';').map((v) => v.replace(/"/g, '').trim());
  if (vals.length < headers.length) continue;

  rows.push({
    CS_SEXO: vals[COL.CS_SEXO],
    NU_IDADE_N: vals[COL.NU_IDADE_N],
    CS_RACA: vals[COL.CS_RACA],
    VACINA: vals[COL.VACINA],
    UTI: vals[COL.UTI],
    CLASSI_FIN: vals[COL.CLASSI_FIN],
    EVOLUCAO: vals[COL.EVOLUCAO],
  });
}

console.log(`Registros carregados: ${rows.length}`);

// ── Labels ───────────────────────────────────────────────────────────────────
const SEXO_LABELS = { '1': 'Masculino', '2': 'Feminino', '9': 'Ignorado', 'M': 'Masculino', 'F': 'Feminino', 'I': 'Ignorado' };
const RACA_LABELS = { '1': 'Branca', '2': 'Preta', '3': 'Amarela', '4': 'Parda', '5': 'Indígena', '9': 'Ignorado' };
const CLASSI_LABELS = {
  '1': 'SRAG por influenza',
  '2': 'SRAG por outro vírus respiratório',
  '3': 'SRAG por outro agente etiológico',
  '4': 'SRAG não especificado',
  '5': 'SRAG por COVID-19',
};
const EVOLUCAO_LABELS = { '1': 'Cura', '2': 'Óbito', '3': 'Óbito por outras causas', '9': 'Ignorado' };
const VACINA_LABELS = { '1': 'Sim', '2': 'Não', '9': 'Ignorado', 'Sim': 'Sim', 'Não': 'Não' };
const UTI_LABELS = { '1': 'Sim', '2': 'Não', '9': 'Ignorado', 'Sim': 'Sim', 'Não': 'Não' };

// ── Helper: frequency table ──────────────────────────────────────────────────
function frequencyTable(data, field, labels) {
  const counts = {};
  for (const r of data) {
    const v = r[field];
    counts[v] = (counts[v] || 0) + 1;
  }
  const total = data.length;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => ({
      category: cat,
      label: labels[cat] || `Cat. ${cat}`,
      count,
      percentage: Math.round((count / total) * 10000) / 100,
    }));
}

// ── Item 1: CS_SEXO ─────────────────────────────────────────────────────────
console.log('Item 1 — CS_SEXO...');
const sexoFreq = frequencyTable(rows, 'CS_SEXO', SEXO_LABELS);

// ── Item 2: CS_RACA ─────────────────────────────────────────────────────────
console.log('Item 2 — CS_RACA...');
const racaFreq = frequencyTable(rows, 'CS_RACA', RACA_LABELS);
// Find top (excluding Ignorado)
const racaValid = racaFreq.filter((f) => f.category !== '9');
const racaTop = racaValid[0] || { label: '-', percentage: 0 };

// ── Item 3: CLASSI_FIN ──────────────────────────────────────────────────────
console.log('Item 3 — CLASSI_FIN...');
const classificacaoFreq = frequencyTable(rows, 'CLASSI_FIN', CLASSI_LABELS);
const classificacaoTop = classificacaoFreq[0]?.label || '-';

// ── Item 4: Histograma NU_IDADE_N (amplitude 10, densidade) ─────────────────
console.log('Item 4 — NU_IDADE_N histograma...');
const idades = rows.map((r) => parseInt(r.NU_IDADE_N)).filter((v) => !isNaN(v) && v >= 0);
const idadeMin = 0;
let idadeMax = 0;
for (const v of idades) if (v > idadeMax) idadeMax = v;
const binWidth = 10;
const numBins = Math.ceil((idadeMax - idadeMin) / binWidth);
const idadeHistogram = [];

for (let i = 0; i < numBins; i++) {
  const binStart = idadeMin + i * binWidth;
  const binEnd = binStart + binWidth;
  const count = idades.filter((v) => i === numBins - 1 ? v >= binStart && v <= binEnd : v >= binStart && v < binEnd).length;
  const density = idades.length > 0 ? count / (idades.length * binWidth) : 0;
  idadeHistogram.push({
    binStart,
    binEnd,
    count,
    density: Math.round(density * 10000) / 10000,
    label: `${binStart}–${binEnd}`,
  });
}
const idadeTopBin = idadeHistogram.reduce((a, b) => b.count > a.count ? b : a, idadeHistogram[0]);

// ── Item 5: Resumo estatístico NU_IDADE_N ───────────────────────────────────
console.log('Item 5 — NU_IDADE_N resumo...');
const sortedIdades = [...idades].sort((a, b) => a - b);
const mean = idades.reduce((a, b) => a + b, 0) / idades.length;
const median = sortedIdades.length % 2 === 0
  ? (sortedIdades[sortedIdades.length / 2 - 1] + sortedIdades[sortedIdades.length / 2]) / 2
  : sortedIdades[Math.floor(sortedIdades.length / 2)];
const min = sortedIdades[0];
const max = sortedIdades[sortedIdades.length - 1];

const percentile = (arr, p) => {
  const idx = (p / 100) * (arr.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return arr[lo];
  return arr[lo] + (arr[hi] - arr[lo]) * (idx - lo);
};

const q1 = percentile(sortedIdades, 25);
const q3 = percentile(sortedIdades, 75);
const variance = idades.reduce((s, v) => s + (v - mean) ** 2, 0) / idades.length;
const stdDev = Math.sqrt(variance);
const cv = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;

const idadeSummary = {
  count: idades.length,
  mean: Math.round(mean * 100) / 100,
  median: Math.round(median * 100) / 100,
  min,
  max,
  q1: Math.round(q1 * 100) / 100,
  q3: Math.round(q3 * 100) / 100,
  stdDev: Math.round(stdDev * 100) / 100,
  cv: Math.round(cv * 100) / 100,
};

// ── Item 6: Moda EVOLUCAO ───────────────────────────────────────────────────
console.log('Item 6 — EVOLUCAO...');
const evolucaoFreq = frequencyTable(rows, 'EVOLUCAO', EVOLUCAO_LABELS);
const evolucaoTop = evolucaoFreq[0] || { label: '-', count: 0 };

// ── Item 7: Tabela cruzada VACINA × UTI (exclui Ignorado e NA) ─────────────
console.log('Item 7 — VACINA × UTI...');
const vacinaUTIRaw = rows.filter(
  (r) => r.VACINA !== '9' && r.VACINA !== '' && r.UTI !== '9' && r.UTI !== ''
);

const vacinaUTIMap = {};
for (const r of vacinaUTIRaw) {
  const vLabel = VACINA_LABELS[r.VACINA] || r.VACINA;
  const uLabel = UTI_LABELS[r.UTI] || r.UTI;
  const key = `${vLabel}|${uLabel}`;
  vacinaUTIMap[key] = (vacinaUTIMap[key] || 0) + 1;
}

// Row totals
const vacinaRowTotals = {};
for (const r of vacinaUTIRaw) {
  const vLabel = VACINA_LABELS[r.VACINA] || r.VACINA;
  vacinaRowTotals[vLabel] = (vacinaRowTotals[vLabel] || 0) + 1;
}

const vacinaUTI = [];
const rowLabels = ['Sim', 'Não'];
const colLabels = ['Sim', 'Não'];
for (const row of rowLabels) {
  for (const col of colLabels) {
    const key = `${row}|${col}`;
    const count = vacinaUTIMap[key] || 0;
    const rowTotal = vacinaRowTotals[row] || 1;
    vacinaUTI.push({
      row: `Vacina: ${row}`,
      col: `UTI: ${col}`,
      count,
      rowPercent: Math.round((count / rowTotal) * 10000) / 100,
    });
  }
}

// Answer: % of vaccinated in UTI, % of non-vaccinated in UTI
const vacinaSimTotal = vacinaRowTotals['Sim'] || 1;
const vacinaNaoTotal = vacinaRowTotals['Não'] || 1;
const vacinaSimUTI = Math.round(((vacinaUTIMap['Sim|Sim'] || 0) / vacinaSimTotal) * 10000) / 100;
const vacinaNaoUTI = Math.round(((vacinaUTIMap['Não|Sim'] || 0) / vacinaNaoTotal) * 10000) / 100;

// ── Item 8: Box-plot NU_IDADE_N × CS_SEXO ──────────────────────────────────
console.log('Item 8 — Box-Plot...');
const boxPlotData = [];
const sexoGroups = { 'M': 'Masculino', 'F': 'Feminino', '1': 'Masculino', '2': 'Feminino' };
for (const [code, label] of Object.entries(sexoGroups)) {
  const groupI = rows.filter((r) => r.CS_SEXO === code).map((r) => parseInt(r.NU_IDADE_N)).filter((v) => !isNaN(v) && v >= 0);
  if (groupI.length === 0) continue;
  const s = [...groupI].sort((a, b) => a - b);
  const gMin = s[0];
  const gMax = s[s.length - 1];
  const gQ1 = percentile(s, 25);
  const gQ3 = percentile(s, 75);
  const gMedian = s.length % 2 === 0 ? (s[s.length / 2 - 1] + s[s.length / 2]) / 2 : s[Math.floor(s.length / 2)];
  const iqr = gQ3 - gQ1;
  const lowerFence = gQ1 - 1.5 * iqr;
  const upperFence = gQ3 + 1.5 * iqr;
  const outliers = s.filter((v) => v < lowerFence || v > upperFence);

  boxPlotData.push({
    label,
    min: gMin,
    q1: Math.round(gQ1 * 100) / 100,
    median: Math.round(gMedian * 100) / 100,
    q3: Math.round(gQ3 * 100) / 100,
    max: gMax,
    outliers: outliers.slice(0, 50), // limit outliers for performance
    count: groupI.length,
  });
}

// ── Dashboard interativo: dados agregados ───────────────────────────────────
console.log('Dashboard — dados agregados...');

// Summary stats
const totalObitos = rows.filter((r) => r.EVOLUCAO === '2' || r.EVOLUCAO === '3').length;
const totalUTI = rows.filter((r) => r.UTI === '1').length;
const totalVacina = rows.filter((r) => r.VACINA === '1').length;
const taxaLetalidade = rows.length > 0 ? Math.round((totalObitos / rows.length) * 10000) / 100 : 0;

const dashboardSummary = {
  totalNotificacoes: rows.length,
  totalObitos,
  totalUTI,
  totalVacina,
  taxaLetalidade,
};

// Histograma de idade com amplitude 5 (para dashboard interativo)
const idadeBins5 = [];
for (let i = 0; i <= 100; i += 5) {
  const count = idades.filter((v) => i === 100 ? v >= i && v <= i + 5 : v >= i && v < i + 5).length;
  const density = idades.length > 0 ? count / (idades.length * 5) : 0;
  idadeBins5.push({
    binStart: i,
    binEnd: i + 5,
    count,
    density: Math.round(density * 10000) / 10000,
    label: `${i}–${i + 5}`,
  });
}

// Idade por sexo (para histograma comparativo)
const idadePorSexo = {};
for (const [code, label] of Object.entries(sexoGroups)) {
  const groupI = rows.filter((r) => r.CS_SEXO === code).map((r) => parseInt(r.NU_IDADE_N)).filter((v) => !isNaN(v) && v >= 0);
  if (groupI.length === 0) continue;
  const bins = [];
  for (let i = 0; i <= 100; i += 5) {
    const count = groupI.filter((v) => i === 100 ? v >= i && v <= i + 5 : v >= i && v < i + 5).length;
    bins.push({ binStart: i, binEnd: i + 5, count, label: `${i}–${i + 5}` });
  }
  idadePorSexo[label] = bins;
}

// Evolução por sexo
const evolucaoPorSexo = {};
for (const [code, label] of Object.entries(sexoGroups)) {
  const filtered = rows.filter((r) => r.CS_SEXO === code);
  evolucaoPorSexo[label] = frequencyTable(filtered, 'EVOLUCAO', EVOLUCAO_LABELS);
}

// Classificação por sexo
const classificacaoPorSexo = {};
for (const [code, label] of Object.entries(sexoGroups)) {
  const filtered = rows.filter((r) => r.CS_SEXO === code);
  classificacaoPorSexo[label] = frequencyTable(filtered, 'CLASSI_FIN', CLASSI_LABELS);
}

// Raça por classificação (top 3 classificações)
const racaPorClassificacao = {};
const topClassifCodes = classificacaoFreq.slice(0, 3).map((f) => f.category);
for (const code of topClassifCodes) {
  const filtered = rows.filter((r) => r.CLASSI_FIN === code);
  racaPorClassificacao[CLASSI_LABELS[code] || code] = frequencyTable(filtered, 'CS_RACA', RACA_LABELS);
}

// ── Dados brutos compactos (para filtragem dinâmica no dashboard) ───────────
console.log('Gerando dados brutos compactos...');

// Formato: [sexo, idade, raca, classificacao, vacina, uti, evolucao]
// Chaves curtas reduzem o tamanho do arquivo
const RAW_HEADER = 'sexo|idade|raca|classif|vacina|uti|evol';
const rawData = rows.map((r) => [
  r.CS_SEXO,
  parseInt(r.NU_IDADE_N) || 0,
  r.CS_RACA,
  r.CLASSI_FIN,
  r.VACINA,
  r.UTI,
  r.EVOLUCAO,
]);

// ── Serialização → src/data/srag.ts ─────────────────────────────────────────
console.log('Gerando srag.ts...');

const content = `// Gerado por scripts/export-data.mjs — NÃO edite manualmente.
// Para regenerar: npm run data:export
// Fonte: INFLUD26-20-07-2026.csv (SIVEP-Gripe — SRAG 2026)

export interface FrequencyRow {
  category: string;
  label: string;
  count: number;
  percentage: number;
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
  density: number;
  label: string;
}

export interface SummaryStats {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  stdDev: number;
  cv: number;
}

export interface BoxPlotData {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  count: number;
}

export interface CrossTabCell {
  row: string;
  col: string;
  count: number;
  rowPercent: number;
}

export interface DashboardSummary {
  totalNotificacoes: number;
  totalObitos: number;
  totalUTI: number;
  totalVacina: number;
  taxaLetalidade: number;
}

export interface IdadeBin {
  binStart: number;
  binEnd: number;
  count: number;
  density?: number;
  label: string;
}

/** Dados brutos compactos: [sexo, idade, raca, classificacao, vacina, uti, evolucao] */
export type SRAGRow = [string, number, string, string, string, string, string];

export interface SRAGData {
  totalRecords: number;
  sexoFreq: FrequencyRow[];
  racaFreq: FrequencyRow[];
  racaTopCategory: string;
  racaTopProportion: number;
  classificacaoFreq: FrequencyRow[];
  classificacaoTop: string;
  idadeHistogram: HistogramBin[];
  idadeTopBin: string;
  idadeSummary: SummaryStats;
  evolucaoFreq: FrequencyRow[];
  evolucaoModa: string;
  evolucaoModaCount: number;
  vacinaUTI: CrossTabCell[];
  vacinaSimUTI: number;
  vacinaNaoUTI: number;
  boxPlotData: BoxPlotData[];
  // Dashboard interativo
  dashboardSummary: DashboardSummary;
  idadeBins5: IdadeBin[];
  idadePorSexo: Record<string, IdadeBin[]>;
  evolucaoPorSexo: Record<string, FrequencyRow[]>;
  classificacaoPorSexo: Record<string, FrequencyRow[]>;
  racaPorClassificacao: Record<string, FrequencyRow[]>;
  /** Dados brutos para filtragem dinâmica */
  rawData: SRAGRow[];
}

export const sragData: SRAGData = {
  totalRecords: ${rows.length},
  sexoFreq: ${JSON.stringify(sexoFreq, null, 2)},
  racaFreq: ${JSON.stringify(racaFreq, null, 2)},
  racaTopCategory: ${JSON.stringify(racaTop.label)},
  racaTopProportion: ${racaTop.percentage},
  classificacaoFreq: ${JSON.stringify(classificacaoFreq, null, 2)},
  classificacaoTop: ${JSON.stringify(classificacaoTop)},
  idadeHistogram: ${JSON.stringify(idadeHistogram, null, 2)},
  idadeTopBin: ${JSON.stringify(idadeTopBin.label)},
  idadeSummary: ${JSON.stringify(idadeSummary, null, 2)},
  evolucaoFreq: ${JSON.stringify(evolucaoFreq, null, 2)},
  evolucaoModa: ${JSON.stringify(evolucaoTop.label)},
  evolucaoModaCount: ${evolucaoTop.count},
  vacinaUTI: ${JSON.stringify(vacinaUTI, null, 2)},
  vacinaSimUTI: ${vacinaSimUTI},
  vacinaNaoUTI: ${vacinaNaoUTI},
  boxPlotData: ${JSON.stringify(boxPlotData, null, 2)},
  // Dashboard interativo
  dashboardSummary: ${JSON.stringify(dashboardSummary, null, 2)},
  idadeBins5: ${JSON.stringify(idadeBins5, null, 2)},
  idadePorSexo: ${JSON.stringify(idadePorSexo, null, 2)},
  evolucaoPorSexo: ${JSON.stringify(evolucaoPorSexo, null, 2)},
  classificacaoPorSexo: ${JSON.stringify(classificacaoPorSexo, null, 2)},
  racaPorClassificacao: ${JSON.stringify(racaPorClassificacao, null, 2)},
  rawData: ${JSON.stringify(rawData)},
};
`;

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, content, 'utf8');

// ── Relatório ────────────────────────────────────────────────────────────────
const sizeKb = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(1);
console.log('\n=== Relatório da exportação ===');
console.log(`Registros:              ${rows.length.toLocaleString('pt-BR')}`);
console.log(`Item 1 — Sexo:          ${sexoFreq.map((f) => `${f.label}: ${f.percentage.toFixed(2)}%`).join(', ')}`);
console.log(`Item 2 — Raça top:      ${racaTop.label} (${racaTop.percentage.toFixed(4)}%)`);
console.log(`Item 3 — Classif. top:  ${classificacaoTop}`);
console.log(`Item 4 — Idade top bin: ${idadeTopBin.label} (${idadeTopBin.count} registros)`);
console.log(`Item 5 — Idade summary: média=${idadeSummary.mean}, mediana=${idadeSummary.median}, DP=${idadeSummary.stdDev}, CV=${idadeSummary.cv}%`);
console.log(`Item 6 — Evolução moda: ${evolucaoTop.label} (${evolucaoTop.count.toLocaleString('pt-BR')})`);
console.log(`Item 7 — Vacina→UTI:    ${vacinaSimUTI}% (vacinados) / ${vacinaNaoUTI}% (não vacinados)`);
console.log(`Item 8 — Box-plot:      ${boxPlotData.map((d) => `${d.label}: med=${d.median}, n=${d.count}`).join(' | ')}`);
console.log(`Dados brutos:           ${rawData.length.toLocaleString('pt-BR')} linhas compactas`);
console.log(`Arquivo gerado:         ${OUT_PATH} (${sizeKb} KB)`);
