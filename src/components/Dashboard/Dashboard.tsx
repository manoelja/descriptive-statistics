import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Filter, X, BarChart3, Lightbulb, TrendingUp, AlertCircle,
  Table2, LayoutGrid, GitCompare, CircleDot,
} from 'lucide-react';
import {
  filtrosVazios, filtrarDados, buildHistogram, buildFrequency, buildCrossTab,
  buildIdadeSexoCrossTab, buildSexoClassificacaoCrossTab, buildRacaSexoCrossTab,
  buildClassificacaoSexoCrossTab, buildEvolucaoSexoCrossTab,
  SEXO_LABELS, RACA_LABELS, CLASSIFICACAO_LABELS, EVOLUCAO_LABELS,
  CLASSIFICACAO_COLORS, RACA_COLORS, EVOLUCAO_COLORS,
  FAIXA_ETARIA_OPTIONS, COL,
  type Filtros,
} from './aggregate';
import SummaryCards from './SummaryCards';
import BarChart from './charts/BarChart';
import HBarChart from './charts/HBarChart';
import Histogram from './charts/Histogram';
import DonutChart from './charts/DonutChart';

// ── Resolve CSS variable to actual color value ───────────────────────────────
function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const THEME_COLORS: Record<string, string> = {};
function chartColor(varName: string, fallback: string): string {
  const key = varName;
  if (!THEME_COLORS[key]) THEME_COLORS[key] = cssVar(varName) || fallback;
  return THEME_COLORS[key];
}
function resetChartColors() { Object.keys(THEME_COLORS).forEach((k) => delete THEME_COLORS[k]); }

import './Dashboard.css';

// ── Dimensões de dados disponíveis ──────────────────────────────────────────
type Dimensao = 'sexo' | 'idade' | 'raca' | 'classificacao' | 'evolucao' | 'vacinaUTI' | null;
type ChartType = 'bar' | 'hbar' | 'donut' | 'histogram' | 'table';

const DIMENSOES: { key: Dimensao; label: string; icon: React.ReactNode; defaultChart: ChartType }[] = [
  { key: 'sexo', label: 'Sexo', icon: <CircleDot size={15} />, defaultChart: 'donut' },
  { key: 'idade', label: 'Idade', icon: <BarChart3 size={15} />, defaultChart: 'histogram' },
  { key: 'raca', label: 'Raça/Cor', icon: <TrendingUp size={15} />, defaultChart: 'hbar' },
  { key: 'classificacao', label: 'Classificação', icon: <LayoutGrid size={15} />, defaultChart: 'bar' },
  { key: 'evolucao', label: 'Evolução', icon: <GitCompare size={15} />, defaultChart: 'donut' },
  { key: 'vacinaUTI', label: 'Vacina × UTI', icon: <Table2 size={15} />, defaultChart: 'hbar' },
];

const CHART_TYPES: { type: ChartType; label: string; icon: React.ReactNode }[] = [
  { type: 'bar', label: 'Barra', icon: <BarChart3 size={15} /> },
  { type: 'hbar', label: 'Horizontal', icon: <TrendingUp size={15} /> },
  { type: 'donut', label: 'Donut', icon: <CircleDot size={15} /> },
  { type: 'histogram', label: 'Histograma', icon: <LayoutGrid size={15} /> },
  { type: 'table', label: 'Tabela', icon: <Table2 size={15} /> },
];

// Filtros primários (colapsáveis)
type FiltroPrimario = 'sexo' | 'faixa' | 'raca' | 'classificacao' | 'vacina' | 'uti';

const FILTRO_PRIMARIO_CONFIG: Record<FiltroPrimario, { label: string; icon: React.ReactNode }> = {
  sexo: { label: 'Sexo', icon: <CircleDot size={14} /> },
  faixa: { label: 'Faixa Etária', icon: <BarChart3 size={14} /> },
  raca: { label: 'Raça/Cor', icon: <TrendingUp size={14} /> },
  classificacao: { label: 'Classificação', icon: <LayoutGrid size={14} /> },
  vacina: { label: 'Vacina', icon: <GitCompare size={14} /> },
  uti: { label: 'UTI', icon: <Table2 size={14} /> },
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [filtros, setFiltros] = useState<Filtros>(filtrosVazios);
  const [activeFilters, setActiveFilters] = useState<FiltroPrimario[]>([]);
  const [dimensao, setDimensao] = useState<Dimensao>(null);
  const [chartType, setChartType] = useState<ChartType>('donut');

  // Reset cached colors when theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => { resetChartColors(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const hasFiltros = Object.values(filtros).some((v) => Array.isArray(v) ? v.length > 0 : v !== '');

  // ── Toggle filtro primário (abre/fecha sub-filtro) ────────────────────────
  const toggleFiltroPrimario = (f: FiltroPrimario) => {
    if (activeFilters.includes(f)) {
      // Ao fechar, limpa os valores daquele filtro
      setFiltros((prev) => ({ ...prev, [f]: [] }));
      setActiveFilters((prev) => prev.filter((x) => x !== f));
    } else {
      setActiveFilters((prev) => [...prev, f]);
    }
  };

  // ── Toggle valor do sub-filtro (múltipla seleção) ──────────────────────────
  const toggleFiltroValor = <K extends keyof Filtros>(key: K, value: string) => {
    setFiltros((prev) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        // Se clicou em "Todos", limpa tudo
        if (value === '') {
          return { ...prev, [key]: [] };
        }
        // Se já existe, remove; senão, adiciona
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [key]: updated };
      }
      return prev;
    });
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetFiltros = () => {
    setFiltros(filtrosVazios);
    setActiveFilters([]);
  };

  // ── Mudar dimensão → auto-muda tipo de gráfico ────────────────────────────
  const mudarDimensao = (d: Dimensao) => {
    if (d === dimensao) {
      setDimensao(null);
    } else {
      setDimensao(d);
      const cfg = DIMENSOES.find((x) => x.key === d);
      if (cfg) setChartType(cfg.defaultChart);
    }
  };

  // ── Dados filtrados (UMA ÚNICA filtragem) ─────────────────────────────────
  const dadosFiltrados = useMemo(() => filtrarDados(filtros), [filtros]);

  // ── Dados para o gráfico selecionado ──────────────────────────────────────
  const chartData = useMemo(() => {
    switch (dimensao) {
      case 'sexo': {
        const freq = buildFrequency(dadosFiltrados, COL.sexo, SEXO_LABELS);
        const sexoData = freq.filter((f) => f.category !== '9' && f.category !== '').map((f) => ({
          label: f.label, value: f.count,
          color: f.category === 'M' ? chartColor('--chart-masculino', '#22d3ee') : f.category === 'F' ? chartColor('--chart-feminino', '#f472b6') : '#a1a1aa',
        }));
        const crossTab = buildSexoClassificacaoCrossTab(dadosFiltrados);
        return {
          title: 'Distribuição por Sexo',
          donut: sexoData,
          bar: sexoData,
          hbar: sexoData,
          crossTab,
        };
      }
      case 'idade': {
        const hist = buildHistogram(dadosFiltrados);
        const crossTab = buildIdadeSexoCrossTab(dadosFiltrados);
        // Top 10 faixas para bar/hbar
        const topBins = [...hist].sort((a, b) => b.count - a.count).slice(0, 10).map((b) => ({
          label: b.label, value: b.count, color: chartColor('--chart-masculino', '#22d3ee'),
        }));
        return {
          title: 'Histograma de Idade',
          histogram: hist,
          bar: topBins,
          hbar: topBins,
          crossTab,
        };
      }
      case 'raca': {
        const freq = buildFrequency(dadosFiltrados, COL.raca, RACA_LABELS);
        const crossTab = buildRacaSexoCrossTab(dadosFiltrados);
        return {
          title: 'Distribuição por Raça/Cor',
          hbar: freq.filter((f) => f.category !== '9').map((f) => ({
            label: f.label, value: f.count, color: RACA_COLORS[f.label] || '#a1a1aa',
          })),
          bar: freq.filter((f) => f.category !== '9' && f.category !== '').map((f) => ({
            label: f.label, value: f.count, color: RACA_COLORS[f.label] || '#a1a1aa',
          })),
          donut: freq.filter((f) => f.category !== '9').map((f) => ({
            label: f.label, value: f.count, color: RACA_COLORS[f.label] || '#a1a1aa',
          })),
          crossTab,
        };
      }
      case 'classificacao': {
        const freq = buildFrequency(dadosFiltrados, COL.classificacao, CLASSIFICACAO_LABELS);
        const crossTab = buildClassificacaoSexoCrossTab(dadosFiltrados);
        return {
          title: 'Classificação Final',
          bar: freq.filter((f) => f.category !== '').map((f) => ({
            label: f.label.length > 20 ? f.label.substring(0, 18) + '…' : f.label,
            value: f.count, color: CLASSIFICACAO_COLORS[f.label] || '#a1a1aa',
          })),
          hbar: freq.filter((f) => f.category !== '').map((f) => ({
            label: f.label.length > 20 ? f.label.substring(0, 18) + '…' : f.label,
            value: f.count, color: CLASSIFICACAO_COLORS[f.label] || '#a1a1aa',
          })),
          donut: freq.filter((f) => f.category !== '').map((f) => ({
            label: f.label.length > 20 ? f.label.substring(0, 18) + '…' : f.label,
            value: f.count, color: CLASSIFICACAO_COLORS[f.label] || '#a1a1aa',
          })),
          crossTab,
        };
      }
      case 'evolucao': {
        const freq = buildFrequency(dadosFiltrados, COL.evolucao, EVOLUCAO_LABELS);
        const crossTab = buildEvolucaoSexoCrossTab(dadosFiltrados);
        return {
          title: 'Evolução',
          donut: freq.filter((f) => f.category !== '9').map((f) => ({
            label: f.label, value: f.count, color: EVOLUCAO_COLORS[f.label] || '#a1a1aa',
          })),
          bar: freq.filter((f) => f.category !== '9' && f.category !== '').map((f) => ({
            label: f.label, value: f.count, color: EVOLUCAO_COLORS[f.label] || '#a1a1aa',
          })),
          hbar: freq.filter((f) => f.category !== '9' && f.category !== '').map((f) => ({
            label: f.label, value: f.count, color: EVOLUCAO_COLORS[f.label] || '#a1a1aa',
          })),
          crossTab,
        };
      }
      case 'vacinaUTI': {
        const crossTab = buildCrossTab(
          dadosFiltrados, COL.vacina, COL.uti,
          { '1': 'Sim', '2': 'Não' }, { '1': 'Sim', '2': 'Não' },
          'Vacina', 'UTI',
        );
        // Dados para bar horizontal: cruzamento real (4 combinações)
        const hbarData = crossTab.map((cell) => ({
          label: `${cell.row.split(': ')[1]} / ${cell.col.split(': ')[1]}`,
          value: cell.count,
          color: cell.row.includes('Sim') && cell.col.includes('Sim')
            ? chartColor('--chart-masculino', '#22d3ee')
            : cell.row.includes('Sim') && cell.col.includes('Não')
              ? chartColor('--chart-feminino', '#f472b6')
              : cell.row.includes('Não') && cell.col.includes('Sim')
                ? chartColor('--chart-outro-agente', '#fbbf24')
                : '#a1a1aa',
        }));
        return {
          title: 'Vacina × UTI — Tabulação Cruzada',
          crossTab,
          hbar: hbarData,
        };
      }
      default:
        return { title: '' };
    }
  }, [dadosFiltrados, dimensao]);

  // ── Insights dinâmicos ────────────────────────────────────────────────────
  const insights = useMemo(() => {
    const total = dadosFiltrados.length;
    if (total === 0) return [];

    const result: { type: 'high' | 'low' | 'info' | 'warning'; text: string }[] = [];

    const sexoFreq = buildFrequency(dadosFiltrados, COL.sexo, SEXO_LABELS);
    const sexoTop = sexoFreq[0];
    if (sexoTop && sexoTop.category !== '9') {
      result.push({ type: 'info', text: `${sexoTop.label} é o sexo mais frequente: ${sexoTop.percentage.toFixed(2)}%.` });
    }

    const hist = buildHistogram(dadosFiltrados);
    const faixaTop = hist.reduce((a, b) => (b.count > a.count ? b : a), hist[0]);
    if (faixaTop) {
      result.push({ type: 'info', text: `Faixa mais afetada: ${faixaTop.label} (${faixaTop.count.toLocaleString('pt-BR')}).` });
    }

    const classFreq = buildFrequency(dadosFiltrados, COL.classificacao, CLASSIFICACAO_LABELS);
    const classTop = classFreq[0];
    if (classTop) {
      result.push({ type: 'warning', text: `Classificação mais frequente: "${classTop.label}".` });
    }

    const obitos = dadosFiltrados.filter((r) => r[COL.evolucao] === '2' || r[COL.evolucao] === '3').length;
    const taxa = total > 0 ? ((obitos / total) * 100).toFixed(2) : '0';
    result.push({ type: 'high', text: `Taxa de letalidade: ${taxa}% (${obitos.toLocaleString('pt-BR')} óbitos em ${total.toLocaleString('pt-BR')}).` });

    const idades = dadosFiltrados.map((r) => r[COL.idade]).filter((v) => v >= 0);
    if (idades.length > 0) {
      const mean = idades.reduce((a, b) => a + b, 0) / idades.length;
      const sorted = [...idades].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      result.push({ type: 'high', text: `Média de idade: ${mean.toFixed(1)} · Mediana: ${median}.` });
    }

    return result;
  }, [dadosFiltrados]);

  // ── Contagem de filtros ativos por primário ───────────────────────────────
  const filtroCount = (key: FiltroPrimario) => {
    const val = filtros[key];
    return Array.isArray(val) ? val.length : val ? 1 : 0;
  };

  // ── Verificar se valor está selecionado ───────────────────────────────────
  const isFiltroAtivo = (key: keyof Filtros, value: string) => {
    const val = filtros[key];
    if (Array.isArray(val)) {
      return value === '' ? val.length === 0 : val.includes(value);
    }
    return val === value;
  };

  return (
    <section id="dashboard" className="dashboard">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('dashboard.title')}
        </motion.h2>

        <SummaryCards />

        {/* ============ CONTROLES ============ */}
        <motion.div className="dashboard-controls cyber-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="controls-header">
            <Filter size={16} />
            <span className="card-label">{t('dashboard.filters')}</span>
            {(hasFiltros || activeFilters.length > 0) && (
              <button className="filter-reset-btn" onClick={resetFiltros}>
                <X size={14} /> {t('dashboard.clear')}
              </button>
            )}
          </div>

          {/* ── Filtros primários (colapsáveis) ── */}
          <div className="primary-filters">
            <div className="primary-filter-buttons">
              {(Object.keys(FILTRO_PRIMARIO_CONFIG) as FiltroPrimario[]).map((f) => {
                const cfg = FILTRO_PRIMARIO_CONFIG[f];
                const count = filtroCount(f);
                return (
                  <button
                    key={f}
                    className={`primary-filter-btn ${activeFilters.includes(f) ? 'active' : ''}`}
                    onClick={() => toggleFiltroPrimario(f)}
                  >
                    {cfg.icon}
                    <span>{cfg.label}</span>
                    {count > 0 && <span className="filter-count">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Sub-filtros ── */}
          {activeFilters.includes('sexo') && (
            <motion.div className="secondary-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span className="control-label">Sexo</span>
              <div className="control-buttons secondary-btns">
                {[
                  { val: '', label: 'Todos' },
                  { val: 'M', label: 'Masculino', color: 'var(--chart-masculino)' },
                  { val: 'F', label: 'Feminino', color: 'var(--chart-feminino)' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    className={`control-btn ${isFiltroAtivo('sexo', opt.val) && (opt.val !== '' || filtros.sexo.length === 0) ? 'active' : ''}`}
                    onClick={() => toggleFiltroValor('sexo', opt.val)}
                  >
                    {opt.color && <span className="metric-dot" style={{ background: opt.color }} />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeFilters.includes('faixa') && (
            <motion.div className="secondary-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span className="control-label">Faixa Etária</span>
              <div className="control-buttons secondary-btns">
                <button className={`control-btn ${filtros.faixa.length === 0 ? 'active' : ''}`} onClick={() => toggleFiltroValor('faixa', '')}>Todas</button>
                {FAIXA_ETARIA_OPTIONS.map((fx) => (
                  <button key={fx} className={`control-btn ${filtros.faixa.includes(fx) ? 'active' : ''}`} onClick={() => toggleFiltroValor('faixa', fx)}>
                    {fx}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeFilters.includes('raca') && (
            <motion.div className="secondary-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span className="control-label">Raça/Cor</span>
              <div className="control-buttons secondary-btns">
                <button className={`control-btn ${filtros.raca.length === 0 ? 'active' : ''}`} onClick={() => toggleFiltroValor('raca', '')}>Todas</button>
                {Object.entries(RACA_LABELS).map(([code, label]) => (
                  <button key={code} className={`control-btn ${filtros.raca.includes(code) ? 'active' : ''}`} onClick={() => toggleFiltroValor('raca', code)}>
                    <span className="metric-dot" style={{ background: RACA_COLORS[label] || '#a1a1aa' }} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeFilters.includes('classificacao') && (
            <motion.div className="secondary-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span className="control-label">Classificação</span>
              <div className="control-buttons secondary-btns">
                <button className={`control-btn ${filtros.classificacao.length === 0 ? 'active' : ''}`} onClick={() => toggleFiltroValor('classificacao', '')}>Todas</button>
                {Object.entries(CLASSIFICACAO_LABELS).map(([code, label]) => (
                  <button key={code} className={`control-btn ${filtros.classificacao.includes(code) ? 'active' : ''}`} onClick={() => toggleFiltroValor('classificacao', code)}>
                    <span className="metric-dot" style={{ background: CLASSIFICACAO_COLORS[label] || '#a1a1aa' }} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeFilters.includes('vacina') && (
            <motion.div className="secondary-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span className="control-label">Vacina</span>
              <div className="control-buttons secondary-btns">
                <button className={`control-btn ${filtros.vacina.length === 0 ? 'active' : ''}`} onClick={() => toggleFiltroValor('vacina', '')}>Todos</button>
                <button className={`control-btn ${filtros.vacina.includes('1') ? 'active' : ''}`} onClick={() => toggleFiltroValor('vacina', '1')}>Sim</button>
                <button className={`control-btn ${filtros.vacina.includes('2') ? 'active' : ''}`} onClick={() => toggleFiltroValor('vacina', '2')}>Não</button>
              </div>
            </motion.div>
          )}

          {activeFilters.includes('uti') && (
            <motion.div className="secondary-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span className="control-label">UTI</span>
              <div className="control-buttons secondary-btns">
                <button className={`control-btn ${filtros.uti.length === 0 ? 'active' : ''}`} onClick={() => toggleFiltroValor('uti', '')}>Todos</button>
                <button className={`control-btn ${filtros.uti.includes('1') ? 'active' : ''}`} onClick={() => toggleFiltroValor('uti', '1')}>Sim</button>
                <button className={`control-btn ${filtros.uti.includes('2') ? 'active' : ''}`} onClick={() => toggleFiltroValor('uti', '2')}>Não</button>
              </div>
            </motion.div>
          )}

          {/* ── Dimensão + Tipo de Gráfico ── */}
          <div className="controls-grid">
            <div className="control-group">
              <span className="control-label">Dimensão</span>
              <div className="control-buttons">
                {DIMENSOES.map((d) => (
                  <button key={d.key} className={`control-btn ${dimensao === d.key ? 'active' : ''}`} onClick={() => mudarDimensao(d.key)}>
                    {d.icon} {d.label}
                  </button>
                ))}
              </div>
            </div>

            {dimensao !== null && (
              <div className="control-group">
                <span className="control-label">Gráfico</span>
                <div className="control-buttons chart-type-btns">
                  {CHART_TYPES
                    .filter((c) => {
                      if (dimensao === 'vacinaUTI') return c.type === 'hbar' || c.type === 'table';
                      if (dimensao === 'idade') return c.type !== 'donut';
                      return c.type !== 'histogram';
                    })
                    .map((c) => (
                      <button key={c.type} className={`control-btn chart-btn ${chartType === c.type ? 'active' : ''}`} onClick={() => setChartType(c.type)}>
                        {c.icon}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ============ ÁREA DO GRÁFICO ============ */}
        <motion.div className="dashboard-chart-wrapper cyber-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          {dimensao === null ? (
            <div className="empty-state">
              <AlertCircle size={48} className="empty-icon" />
              <h3 className="empty-title">Selecione uma dimensão</h3>
              <p className="empty-description">Escolha uma dimensão acima para visualizar os dados.</p>
            </div>
          ) : dadosFiltrados.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} className="empty-icon" />
              <h3 className="empty-title">Nenhum registro encontrado</h3>
              <p className="empty-description">Ajuste os filtros para ver dados.</p>
            </div>
          ) : (
            <>
              <div className="chart-header">
                <span className="chart-title">{chartData.title}</span>
                <span className="chart-subtitle">
                  {dadosFiltrados.length.toLocaleString('pt-BR')} registros
                </span>
              </div>

              <div className={`dashboard-chart-scroll${(chartType === 'hbar' || chartType === 'bar' || chartType === 'table') && dadosFiltrados.length > 100 ? ' scroll-y' : ''}`}>
                {/* ── Tabela Cruzada ── */}
                {chartType === 'table' && 'crossTab' in chartData && (() => {
                  const ct = chartData.crossTab!;
                  const rowKeys = [...new Set(ct.map((c) => c.row))];
                  const colKeys = [...new Set(ct.map((c) => c.col))];
                  const maxCount = Math.max(...ct.map((c) => c.count), 1);
                  const colTotals = colKeys.map((col) => ct.filter((c) => c.col === col).reduce((s, c) => s + c.count, 0));
                  const rowTotalsArr = rowKeys.map((row) => ct.filter((c) => c.row === row).reduce((s, c) => s + c.count, 0));
                  const grandTotal = ct.reduce((s, c) => s + c.count, 0);
                  return (
                    <div className="crosstab-wrapper">
                      <table className="crosstab-table">
                        <thead>
                          <tr>
                            <th className="crosstab-corner"></th>
                            {colKeys.map((col) => (
                              <th key={col} className="crosstab-col-header">
                                <span>{col.split(': ')[1]}</span>
                              </th>
                            ))}
                            <th className="crosstab-total-header">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowKeys.map((row, ri) => (
                            <tr key={row}>
                              <td className="crosstab-row-header">{row.split(': ')[1]}</td>
                              {colKeys.map((col) => {
                                const cell = ct.find((c) => c.row === row && c.col === col);
                                const count = cell?.count ?? 0;
                                const pct = cell?.rowPercent ?? 0;
                                const intensity = count / maxCount;
                                const hue = intensity > 0.5 ? 152 : intensity > 0.25 ? 45 : 0;
                                const sat = 60 + intensity * 30;
                                const light = 95 - intensity * 40;
                                return (
                                  <td key={col} className="crosstab-cell"
                                    style={{ background: `hsla(${hue}, ${sat}%, ${light}%, ${0.15 + intensity * 0.45})` }}>
                                    <span className="crosstab-count">{count.toLocaleString('pt-BR')}</span>
                                    <span className="crosstab-pct">{pct.toFixed(1)}%</span>
                                    <div className="crosstab-bar-bg">
                                      <div className="crosstab-bar-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="crosstab-row-total">
                                <strong>{rowTotalsArr[ri].toLocaleString('pt-BR')}</strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className="crosstab-row-header"><strong>Total</strong></td>
                            {colKeys.map((col, ci) => (
                              <td key={col} className="crosstab-col-total">
                                <strong>{colTotals[ci].toLocaleString('pt-BR')}</strong>
                              </td>
                            ))}
                            <td className="crosstab-grand-total">
                              <strong>{grandTotal.toLocaleString('pt-BR')}</strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  );
                })()}

                {/* ── Histograma ── */}
                {chartType === 'histogram' && 'histogram' in chartData && (
                  <Histogram
                    bins={chartData.histogram!}
                    rawData={dadosFiltrados.map((r) => r[COL.idade]).filter((v) => v >= 0)}
                  />
                )}

                {/* ── Donut ── */}
                {chartType === 'donut' && 'donut' in chartData && (
                  <DonutChart data={chartData.donut!} />
                )}

                {/* ── Barra Vertical ── */}
                {chartType === 'bar' && 'bar' in chartData && (
                  <BarChart data={chartData.bar!} />
                )}

                {/* ── Barra Horizontal ── */}
                {chartType === 'hbar' && 'hbar' in chartData && (
                  <HBarChart data={chartData.hbar!} />
                )}

                {/* ── Fallback: se o tipo não existe para a dimensão ── */}
                {((chartType === 'donut' && !('donut' in chartData)) ||
                  (chartType === 'bar' && !('bar' in chartData)) ||
                  (chartType === 'hbar' && !('hbar' in chartData)) ||
                  (chartType === 'histogram' && !('histogram' in chartData)) ||
                  (chartType === 'table' && !('crossTab' in chartData))) && (
                  <div className="chart-fallback">
                    <p>Tipo de gráfico não disponível para esta dimensão.</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
                      Selecione outro tipo de gráfico ou mude a dimensão.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* ============ INSIGHTS ============ */}
        {!hasFiltros && insights.length > 0 && (
          <motion.div className="insight-card cyber-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <div className="insight-header">
              <Lightbulb size={16} />
              <span className="card-label">Insights</span>
            </div>
            <div className="insight-list">
              {insights.map((insight, i) => (
                <div key={i} className={`insight-item insight-${insight.type}`}>
                  <div className="insight-icon">
                    {insight.type === 'high' && <TrendingUp size={14} />}
                    {insight.type === 'low' && <AlertCircle size={14} />}
                    {insight.type === 'warning' && <AlertCircle size={14} />}
                    {insight.type === 'info' && <Lightbulb size={14} />}
                  </div>
                  <p className="insight-text">{insight.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
