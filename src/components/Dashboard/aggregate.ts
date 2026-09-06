import { sragData, type FrequencyRow, type IdadeBin, type SRAGRow, type CrossTabCell } from '../../data/srag';

// ── Tipos de filtro ─────────────────────────────────────────────────────────
export type FiltroSexo = string[];
export type FiltroFaixa = string[];
export type FiltroRaca = string[];
export type FiltroClassificacao = string[];
export type FiltroVacina = string[];
export type FiltroUTI = string[];

export interface Filtros {
  sexo: FiltroSexo;
  faixa: FiltroFaixa;
  raca: FiltroRaca;
  classificacao: FiltroClassificacao;
  vacina: FiltroVacina;
  uti: FiltroUTI;
}

export const filtrosVazios: Filtros = {
  sexo: [], faixa: [], raca: [], classificacao: [], vacina: [], uti: [],
};

// ── Labels ──────────────────────────────────────────────────────────────────
export const SEXO_LABELS: Record<string, string> = { M: 'Masculino', F: 'Feminino', '1': 'Masculino', '2': 'Feminino' };
export const RACA_LABELS: Record<string, string> = { '1': 'Branca', '2': 'Preta', '3': 'Amarela', '4': 'Parda', '5': 'Indígena' };
export const CLASSIFICACAO_LABELS: Record<string, string> = {
  '1': 'Influenza', '2': 'Outro vírus', '3': 'Outro agente', '4': 'Não especificado', '5': 'COVID-19',
};
export const FAIXA_ETARIA_OPTIONS = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'];

// Mapeamento de código de faixa etária para ranges de idade
const FAIXA_RANGES: Record<string, [number, number]> = {
  '0-9': [0, 9], '10-19': [10, 19], '20-29': [20, 29], '30-39': [30, 39],
  '40-49': [40, 49], '50-59': [50, 59], '60-69': [60, 69], '70-79': [70, 79], '80+': [80, 120],
};

// ── Funções de filtragem de dados brutos ────────────────────────────────────

/**
 * Filtra os dados brutos com base em TODOS os filtros ativos.
 * Cada filtro vazio (array vazio) significa "todos" (sem restrição).
 * Índices do SRAGRow: [0]=sexo, [1]=idade, [2]=raca, [3]=classificacao, [4]=vacina, [5]=uti, [6]=evolucao
 */
export function filtrarDados(f: Filtros): SRAGRow[] {
  return sragData.rawData.filter((row) => {
    if (f.sexo.length > 0 && !f.sexo.includes(row[0])) return false;
    if (f.raca.length > 0 && !f.raca.includes(row[2])) return false;
    if (f.classificacao.length > 0 && !f.classificacao.includes(row[3])) return false;
    if (f.vacina.length > 0 && !f.vacina.includes(row[4])) return false;
    if (f.uti.length > 0 && !f.uti.includes(row[5])) return false;
    if (f.faixa.length > 0) {
      const idade = row[1];
      const inAnyRange = f.faixa.some((fx) => {
        const [min, max] = FAIXA_RANGES[fx];
        return idade >= min && idade <= max;
      });
      if (!inAnyRange) return false;
    }
    return true;
  });
}

/** Índices das colunas no SRAGRow */
export const COL = { sexo: 0, idade: 1, raca: 2, classificacao: 3, vacina: 4, uti: 5, evolucao: 6 } as const;

// ── Helpers: construir tabelas a partir de dados filtrados ──────────────────

/** Labels para código de evolução */
export const EVOLUCAO_LABELS: Record<string, string> = { '1': 'Cura', '2': 'Óbito', '3': 'Óbito por outras causas', '9': 'Ignorado' };

/**
 * Constrói uma tabela de frequência a partir dos dados filtrados para um campo específico.
 * Retorna FrequencyRow[] pronto para uso nos gráficos.
 */
export function buildFrequency(rows: SRAGRow[], colIdx: number, labelMap?: Record<string, string>): FrequencyRow[] {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const v = String(row[colIdx]);
    counts[v] = (counts[v] || 0) + 1;
  }
  const total = rows.length;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => ({
      category: cat,
      label: labelMap?.[cat] || cat,
      count,
      percentage: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }));
}

/**
 * Constrói um histograma de idade (bins de 5 anos) a partir dos dados filtrados.
 */
export function buildHistogram(rows: SRAGRow[]): IdadeBin[] {
  const idades = rows.map((r) => r[1]).filter((v) => v >= 0);
  const total = idades.length;
  const bins: IdadeBin[] = [];
  for (let i = 0; i <= 100; i += 5) {
    const binStart = i;
    const binEnd = i + 5;
    const count = idades.filter((v) => i === 100 ? v >= binStart && v <= binEnd : v >= binStart && v < binEnd).length;
    const density = total > 0 ? count / (total * 5) : 0;
    bins.push({
      binStart,
      binEnd,
      count,
      density: Math.round(density * 10000) / 10000,
      label: `${binStart}–${binEnd}`,
    });
  }
  return bins;
}

/**
 * Constrói tabela cruzada (row × col) a partir dos dados filtrados.
 * Ex: Vacina × UTI.
 */
export function buildCrossTab(
  rows: SRAGRow[],
  rowIdx: number,
  colIdx: number,
  rowLabels: Record<string, string>,
  colLabels: Record<string, string>,
  rowDisplayName: string,
  colDisplayName: string,
  excludeValues: string[] = ['9', ''],
): CrossTabCell[] {
  const filtered = rows.filter((r) => !excludeValues.includes(String(r[rowIdx])) && !excludeValues.includes(String(r[colIdx])));

  const cellCounts: Record<string, number> = {};
  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {};
  let grandTotal = 0;

  for (const r of filtered) {
    const rv = String(r[rowIdx]);
    const cv = String(r[colIdx]);
    const key = `${rv}|${cv}`;
    cellCounts[key] = (cellCounts[key] || 0) + 1;
    rowTotals[rv] = (rowTotals[rv] || 0) + 1;
    colTotals[cv] = (colTotals[cv] || 0) + 1;
    grandTotal++;
  }

  const result: CrossTabCell[] = [];
  for (const [rowCode, rowLabel] of Object.entries(rowLabels)) {
    for (const [colCode, colLabel] of Object.entries(colLabels)) {
      const key = `${rowCode}|${colCode}`;
      const count = cellCounts[key] || 0;
      const rowTotal = rowTotals[rowCode] || 1;
      const colTotal = colTotals[colCode] || 1;
      result.push({
        row: `${rowDisplayName}: ${rowLabel}`,
        col: `${colDisplayName}: ${colLabel}`,
        count,
        rowPercent: Math.round((count / rowTotal) * 10000) / 100,
        colPercent: Math.round((count / colTotal) * 10000) / 100,
        rowTotal,
        colTotal,
        grandTotal,
      });
    }
  }
  return result;
}

// ── Cores dos gráficos (CSS variable → fallback) ────────────────────────────
export const CHART_COLORS: Record<string, string> = {
  masculino: 'var(--chart-masculino)',
  feminino: 'var(--chart-feminino)',
  influenza: 'var(--chart-influenza)',
  outroVirus: 'var(--chart-outro-virus)',
  outroAgente: 'var(--chart-outro-agente)',
  naoEspecificado: 'var(--chart-nao-espec)',
  covid: 'var(--chart-covid)',
  branca: 'var(--chart-branca)',
  preta: 'var(--chart-preta)',
  amarela: 'var(--chart-amarela)',
  parda: 'var(--chart-parda)',
  indigena: 'var(--chart-indigena)',
  cura: 'var(--chart-cura)',
  obito: 'var(--chart-obito)',
  obitoOutras: 'var(--chart-obito-outras)',
  default: 'var(--chart-default)',
};

export const CLASSIFICACAO_COLORS: Record<string, string> = {
  'SRAG por influenza': 'var(--chart-influenza)',
  'SRAG por outro vírus respiratório': 'var(--chart-outro-virus)',
  'SRAG por outro agente etiológico': 'var(--chart-outro-agente)',
  'SRAG não especificado': 'var(--chart-nao-espec)',
  'SRAG por COVID-19': 'var(--chart-covid)',
};

export const RACA_COLORS: Record<string, string> = {
  Branca: 'var(--chart-branca)',
  Preta: 'var(--chart-preta)',
  Amarela: 'var(--chart-amarela)',
  Parda: 'var(--chart-parda)',
  Indígena: 'var(--chart-indigena)',
  Ignorado: '#a1a1aa',
};

export const EVOLUCAO_COLORS: Record<string, string> = {
  Cura: 'var(--chart-cura)',
  Óbito: 'var(--chart-obito)',
  'Óbito por outras causas': 'var(--chart-obito-outras)',
  Ignorado: '#a1a1aa',
};
