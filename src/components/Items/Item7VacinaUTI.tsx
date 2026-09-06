import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sragData } from '../../data/srag';

const Item7VacinaUTI = () => {
  const { t } = useTranslation();
  const cells = sragData.vacinaUTI;

  const rows = useMemo(() => {
    const map = new Map<string, Map<string, { count: number; rowPercent: number }>>();
    for (const c of cells) {
      if (!map.has(c.row)) map.set(c.row, new Map());
      map.get(c.row)!.set(c.col, { count: c.count, rowPercent: c.rowPercent });
    }
    return map;
  }, [cells]);

  const rowLabels = useMemo(() => [...new Set(cells.map((c) => c.row))], [cells]);
  const colLabels = useMemo(() => [...new Set(cells.map((c) => c.col))], [cells]);

  return (
    <motion.div
      className="item-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="item-subtitle">{t('items.item7.subtitle')}</div>
      <div className="item-header">
        <div className="item-number">7</div>
        <h3 className="item-title">{t('items.item7.title')}</h3>
      </div>
      <p className="item-description">{t('items.item7.description')}</p>

      <div className="item-content">
        <table className="crosstab-table">
          <thead>
            <tr>
              <th>VACINA \ UTI</th>
              {colLabels.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((row) => (
              <tr key={row}>
                <td className="row-header">{row}</td>
                {colLabels.map((col) => {
                  const cell = rows.get(row)?.get(col);
                  const pct = cell?.rowPercent ?? 0;
                  const heatClass = pct > 10 ? 'heat-high' : pct > 5 ? 'heat-mid' : '';
                  return (
                    <td key={col} className={heatClass}>
                      {cell ? `${pct.toFixed(2)}%` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="answer-card">
          <div className="answer-label">{t('items.answer')}</div>
          <p className="answer-text">
            Vacinados internados em UTI: {sragData.vacinaSimUTI.toFixed(2)}% · Não vacinados internados em UTI: {sragData.vacinaNaoUTI.toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Item7VacinaUTI;
