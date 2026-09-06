import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

type CalcType = 'frequency' | 'proportion' | 'mean' | 'median' | 'stddev' | 'range' | 'mode';

interface MiniCalculatorProps {
  type: CalcType;
}

interface InputWithArrowsProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  wide?: boolean;
  placeholder?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

const InputWithArrows = ({
  label,
  value,
  onChange,
  wide = false,
  placeholder,
  onMouseDown,
  onTouchStart,
}: InputWithArrowsProps) => {
  const [localValue, setLocalValue] = useState(value);
  
  // Sincronizar quando value muda de fora
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const rafRef = useRef<number | null>(null);
  const directionRef = useRef<number>(0); // 1 = up, -1 = down, 0 = stop

  // Spin simples com setInterval (velocidade constante)
  const spinLoop = useCallback(() => {
    if (directionRef.current !== 0) {
      const num = parseFloat(localValue) || 0;
      const newValue = (num + directionRef.current).toString();
      setLocalValue(newValue);
      onChange(newValue);
      rafRef.current = requestAnimationFrame(spinLoop);
    }
  }, [localValue, onChange]);

  const startIncrement = useCallback(() => {
    directionRef.current = 1;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(spinLoop);
  }, [spinLoop]);

  const startDecrement = useCallback(() => {
    directionRef.current = -1;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(spinLoop);
  }, [spinLoop]);

  const stopAllIntervals = useCallback(() => {
    directionRef.current = 0;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleStopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="calc-row">
      <label htmlFor={`calc-${label}`}>{label}</label>
      <div className="input-wrapper" onClick={handleStopPropagation}>
        <input
          id={`calc-${label}`}
          name={`calc-${label}`}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`calc-input ${wide ? 'calc-input-wide' : ''} input-with-arrows`}
          placeholder={placeholder}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        />
        <button
          type="button"
          className="arrow-btn arrow-down"
          onMouseDown={(e) => {
            e.stopPropagation();
            startDecrement();
          }}
          onMouseUp={() => stopAllIntervals()}
          onMouseLeave={() => stopAllIntervals()}
          onTouchStart={(e) => {
            e.stopPropagation();
            startDecrement();
          }}
          onTouchEnd={() => stopAllIntervals()}
        >
          <ChevronDown size={12} />
        </button>
        <button
          type="button"
          className="arrow-btn arrow-up"
          onMouseDown={(e) => {
            e.stopPropagation();
            startIncrement();
          }}
          onMouseUp={() => stopAllIntervals()}
          onMouseLeave={() => stopAllIntervals()}
          onTouchStart={(e) => {
            e.stopPropagation();
            startIncrement();
          }}
          onTouchEnd={() => stopAllIntervals()}
        >
          <ChevronUp size={12} />
        </button>
      </div>
    </div>
  );
};

const MiniCalculator = ({ type }: MiniCalculatorProps) => {
  const [inputValues, setInputValues] = useState('10, 20, 30, 40, 50');
  const [totalCount, setTotalCount] = useState('100');
  const [partCount, setPartCount] = useState('45');

  const handleStopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  const values = useMemo(() => {
    return inputValues
      .split(/[,\s]+/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));
  }, [inputValues]);

  const result = useMemo(() => {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const stddev = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Mode
    const freq: Record<number, number> = {};
    values.forEach((v) => {
      freq[v] = (freq[v] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq)
      .filter(([, f]) => f === maxFreq)
      .map(([v]) => Number(v));

    return { n, sum, mean, median, stddev, min, max, range, modes, maxFreq };
  }, [values]);

  const tc = (total: number, part: number) =>
    total > 0 ? ((part / total) * 100).toFixed(2) : '0';

  if (type === 'frequency' || type === 'proportion') {
    const t = parseFloat(totalCount) || 0;
    const p = parseFloat(partCount) || 0;
    const pct = tc(t, p);
    return (
      <div className="mini-calc">
        <InputWithArrows
          label="N (total)"
          value={totalCount}
          onChange={setTotalCount}
          onMouseDown={handleStopPropagation}
          onTouchStart={handleStopPropagation}
        />
        <InputWithArrows
          label="nᵢ (parte)"
          value={partCount}
          onChange={setPartCount}
          onMouseDown={handleStopPropagation}
          onTouchStart={handleStopPropagation}
        />
        <div className="calc-result" onClick={handleStopPropagation}>
          <span className="calc-result-label">Resultado:</span>
          <span className="calc-result-value">{pct}%</span>
        </div>
      </div>
    );
  }

  if (type === 'mode') {
    return (
      <div className="mini-calc">
        <InputWithArrows
          label="Valores (separados por vírgula)"
          value={inputValues}
          onChange={setInputValues}
          wide
          placeholder="ex: 10, 20, 20, 30"
          onMouseDown={handleStopPropagation}
          onTouchStart={handleStopPropagation}
        />
        {result && (
          <div className="calc-result" onClick={handleStopPropagation}>
            <span className="calc-result-label">Moda:</span>
            <span className="calc-result-value">
              {result.modes.length === result.n
                ? '— (sem moda)'
                : result.modes.join(', ')}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mini-calc">
      <InputWithArrows
        label="Valores (separados por vírgula)"
        value={inputValues}
        onChange={setInputValues}
        wide
        placeholder="ex: 10, 20, 30, 40, 50"
        onMouseDown={handleStopPropagation}
        onTouchStart={handleStopPropagation}
      />
      {result && (
        <div className="calc-results-grid" onClick={handleStopPropagation}>
          {type === 'mean' && (
            <>
              <div className="calc-metric">
                <span className="metric-label">Σx</span>
                <span className="metric-value">{result.sum.toFixed(2)}</span>
              </div>
              <div className="calc-metric">
                <span className="metric-label">n</span>
                <span className="metric-value">{result.n}</span>
              </div>
              <div className="calc-metric highlight">
                <span className="metric-label">x̄</span>
                <span className="metric-value">{result.mean.toFixed(2)}</span>
              </div>
            </>
          )}
          {type === 'median' && (
            <>
              <div className="calc-metric">
                <span className="metric-label">Ordenados</span>
                <span className="metric-value">
                  {[...values].sort((a, b) => a - b).join(', ')}
                </span>
              </div>
              <div className="calc-metric highlight">
                <span className="metric-label">M</span>
                <span className="metric-value">{result.median.toFixed(2)}</span>
              </div>
            </>
          )}
          {type === 'stddev' && (
            <>
              <div className="calc-metric">
                <span className="metric-label">x̄</span>
                <span className="metric-value">{result.mean.toFixed(2)}</span>
              </div>
              <div className="calc-metric highlight">
                <span className="metric-label">σ</span>
                <span className="metric-value">{result.stddev.toFixed(2)}</span>
              </div>
            </>
          )}
          {type === 'range' && (
            <>
              <div className="calc-metric">
                <span className="metric-label">xₘᵢₙ</span>
                <span className="metric-value">{result.min}</span>
              </div>
              <div className="calc-metric">
                <span className="metric-label">xₘₐₓ</span>
                <span className="metric-value">{result.max}</span>
              </div>
              <div className="calc-metric highlight">
                <span className="metric-label">A</span>
                <span className="metric-value">{result.range}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCalculator;
