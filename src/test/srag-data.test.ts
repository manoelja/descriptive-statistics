import { describe, it, expect } from 'vitest';
import { sragData } from '../data/srag';

describe('sragData — integridade geral', () => {
  it('totalRecords > 0 (dados exportados)', () => {
    expect(sragData.totalRecords).toBeGreaterThan(0);
  });
});

describe('Item 1 — CS_SEXO', () => {
  it('tem frequências para Masculino e Feminino', () => {
    const labels = sragData.sexoFreq.map((f) => f.label);
    expect(labels).toContain('Masculino');
    expect(labels).toContain('Feminino');
  });

  it('percentagens somam ~100%', () => {
    const total = sragData.sexoFreq.reduce((s, f) => s + f.percentage, 0);
    expect(total).toBeCloseTo(100, 0);
  });
});

describe('Item 2 — CS_RACA', () => {
  it('tem top category definida', () => {
    expect(sragData.racaTopCategory).toBeTruthy();
    expect(sragData.racaTopProportion).toBeGreaterThan(0);
  });

  it('tem frequências para categorias principais', () => {
    const labels = sragData.racaFreq.map((f) => f.label);
    expect(labels).toContain('Branca');
    expect(labels).toContain('Parda');
  });
});

describe('Item 3 — CLASSI_FIN', () => {
  it('tem top classification', () => {
    expect(sragData.classificacaoTop).toBeTruthy();
  });

  it('tem categorias de classificação', () => {
    expect(sragData.classificacaoFreq.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Item 4 — Histograma idade', () => {
  it('tem bins com densidade', () => {
    expect(sragData.idadeHistogram.length).toBeGreaterThan(0);
    for (const bin of sragData.idadeHistogram) {
      expect(bin.count).toBeGreaterThanOrEqual(0);
      expect(bin.density).toBeGreaterThanOrEqual(0);
    }
  });

  it('top bin definido', () => {
    expect(sragData.idadeTopBin).toBeTruthy();
  });
});

describe('Item 5 — Resumo idade', () => {
  it('medidas resumo presentes', () => {
    const s = sragData.idadeSummary;
    expect(s.count).toBeGreaterThan(0);
    expect(s.mean).toBeGreaterThanOrEqual(0);
    expect(s.median).toBeGreaterThanOrEqual(0);
    expect(s.min).toBeGreaterThanOrEqual(0);
    expect(s.max).toBeGreaterThan(s.min);
    expect(s.q1).toBeLessThanOrEqual(s.median);
    expect(s.median).toBeLessThanOrEqual(s.q3);
    expect(s.stdDev).toBeGreaterThanOrEqual(0);
    expect(s.cv).toBeGreaterThanOrEqual(0);
  });
});

describe('Item 6 — EVOLUCAO', () => {
  it('moda definida', () => {
    expect(sragData.evolucaoModa).toBeTruthy();
    expect(sragData.evolucaoModaCount).toBeGreaterThan(0);
  });
});

describe('Item 7 — VACINA × UTI', () => {
  it('tabela cruzada com células', () => {
    expect(sragData.vacinaUTI.length).toBeGreaterThan(0);
  });

  it('porcentagens de UTI definidas', () => {
    expect(sragData.vacinaSimUTI).toBeGreaterThanOrEqual(0);
    expect(sragData.vacinaNaoUTI).toBeGreaterThanOrEqual(0);
  });
});

describe('Item 8 — Box-Plot', () => {
  it('dados para Masculino e Feminino', () => {
    const labels = sragData.boxPlotData.map((d) => d.label);
    expect(labels).toContain('Masculino');
    expect(labels).toContain('Feminino');
  });

  it('quartis coerentes', () => {
    for (const d of sragData.boxPlotData) {
      expect(d.q1).toBeLessThanOrEqual(d.median);
      expect(d.median).toBeLessThanOrEqual(d.q3);
      expect(d.min).toBeLessThanOrEqual(d.q1);
      expect(d.q3).toBeLessThanOrEqual(d.max);
      expect(d.count).toBeGreaterThan(0);
    }
  });
});
