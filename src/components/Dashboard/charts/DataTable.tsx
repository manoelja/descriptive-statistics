interface DataTableProps {
  columns: string[];
  rows: (string | number)[][];
  highlightMax?: boolean;
}

export default function DataTable({ columns, rows, highlightMax = false }: DataTableProps) {
  // Find max value per column (for highlighting)
  const maxValues = columns.map((_, colIdx) => {
    if (!highlightMax) return -1;
    let max = -1;
    for (const row of rows) {
      const v = typeof row[colIdx] === 'number' ? row[colIdx] as number : -1;
      if (v > max) max = v;
    }
    return max;
  });

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="table-index">{i + 1}</td>
              {row.map((cell, j) => {
                const isMax = highlightMax && typeof cell === 'number' && cell === maxValues[j];
                return (
                  <td key={j} className={`table-value${isMax ? ' highlight-row' : ''}`}>
                    {typeof cell === 'number' ? cell.toLocaleString('pt-BR') : cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
