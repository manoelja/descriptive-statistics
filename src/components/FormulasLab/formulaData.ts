export interface FormulaDef {
  id: string;
  number: number;
  titleKey: string;
  formula: string;
  legend: Record<string, string>;
  sragValue: string;
  sragLabel: string;
  description: string;
  category: 'frequency' | 'central' | 'dispersion';
}

export const formulas: FormulaDef[] = [
  {
    id: 'frequency',
    number: 1,
    titleKey: 'formulas.cards.frequency.title',
    formula: 'fᵢ = (nᵢ / N) × 100',
    legend: {
      'fᵢ': 'formulas.cards.frequency.legend.fi',
      'nᵢ': 'formulas.cards.frequency.legend.ni',
      'N': 'formulas.cards.frequency.legend.N',
    },
    sragValue: '52,11%',
    sragLabel: 'Masculino',
    description: 'formulas.cards.frequency.desc',
    category: 'frequency',
  },
  {
    id: 'proportion',
    number: 2,
    titleKey: 'formulas.cards.proportion.title',
    formula: 'p = x / n',
    legend: {
      'p': 'formulas.cards.proportion.legend.p',
      'x': 'formulas.cards.proportion.legend.x',
      'n': 'formulas.cards.proportion.legend.n',
    },
    sragValue: '48,09%',
    sragLabel: 'Raça Parda',
    description: 'formulas.cards.proportion.desc',
    category: 'frequency',
  },
  {
    id: 'mode',
    number: 3,
    titleKey: 'formulas.cards.mode.title',
    formula: 'Mo = argmax(fᵢ)',
    legend: {
      'Mo': 'formulas.cards.mode.legend.mo',
      'fᵢ': 'formulas.cards.mode.legend.fi',
      'argmax': 'formulas.cards.mode.legend.argmax',
    },
    sragValue: 'Cura',
    sragLabel: '121.887 casos',
    description: 'formulas.cards.mode.desc',
    category: 'central',
  },
  {
    id: 'mean',
    number: 4,
    titleKey: 'formulas.cards.mean.title',
    formula: 'x̄ = Σxᵢ / n',
    legend: {
      'x̄': 'formulas.cards.mean.legend.xbar',
      'xᵢ': 'formulas.cards.mean.legend.xi',
      'Σ': 'formulas.cards.mean.legend.sigma',
      'n': 'formulas.cards.mean.legend.n',
    },
    sragValue: '26,44',
    sragLabel: 'anos',
    description: 'formulas.cards.mean.desc',
    category: 'central',
  },
  {
    id: 'median',
    number: 5,
    titleKey: 'formulas.cards.median.title',
    formula: 'M = x₍ₙ₊₁₎/₂',
    legend: {
      'M': 'formulas.cards.median.legend.M',
      'x₍ₖ₎': 'formulas.cards.median.legend.xk',
      'n': 'formulas.cards.median.legend.n',
    },
    sragValue: '8',
    sragLabel: 'anos',
    description: 'formulas.cards.median.desc',
    category: 'central',
  },
  {
    id: 'stddev',
    number: 6,
    titleKey: 'formulas.cards.stddev.title',
    formula: 'σ = √[ Σ(xᵢ − x̄)² / n ]',
    legend: {
      'σ': 'formulas.cards.stddev.legend.sigma',
      'xᵢ': 'formulas.cards.stddev.legend.xi',
      'x̄': 'formulas.cards.stddev.legend.xbar',
      'n': 'formulas.cards.stddev.legend.n',
    },
    sragValue: '31,26',
    sragLabel: 'anos',
    description: 'formulas.cards.stddev.desc',
    category: 'dispersion',
  },
  {
    id: 'cv',
    number: 7,
    titleKey: 'formulas.cards.cv.title',
    formula: 'CV = (σ / x̄) × 100',
    legend: {
      'CV': 'formulas.cards.cv.legend.CV',
      'σ': 'formulas.cards.cv.legend.sigma',
      'x̄': 'formulas.cards.cv.legend.xbar',
    },
    sragValue: '118,2%',
    sragLabel: 'alta dispersão',
    description: 'formulas.cards.cv.desc',
    category: 'dispersion',
  },
  {
    id: 'range',
    number: 8,
    titleKey: 'formulas.cards.range.title',
    formula: 'A = xₘₐₓ − xₘᵢₙ',
    legend: {
      'A': 'formulas.cards.range.legend.A',
      'xₘₐₓ': 'formulas.cards.range.legend.xmax',
      'xₘᵢₙ': 'formulas.cards.range.legend.xmin',
    },
    sragValue: '115',
    sragLabel: 'anos',
    description: 'formulas.cards.range.desc',
    category: 'dispersion',
  },
];
