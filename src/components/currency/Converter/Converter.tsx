import { useState, type FunctionComponent } from 'react';
import type { ConverterProps } from './Converter.types';
import styles from './Converter.module.css';

// hardcoded here since no one needs more for real money values
const FRACTION_DIGITS = 2;

export const Converter: FunctionComponent<ConverterProps> = ({
  baseAmount,
  baseCode,
  quoteCode,
  rate,
}) => {
  const [baseValue, setBaseValue] = useState(baseAmount);
  const [quoteValue, setQuoteValue] = useState(baseAmount * rate);

  const baseId = `input-base-${baseCode}`;
  const quoteId = `input-quote-${quoteCode}`;

  return (
    <div className={styles.Converter}>
      <div>
        <label className={styles.FieldLabel} htmlFor={baseId}>
          {baseCode}
        </label>
        <input
          id={baseId}
          type="number"
          min={0}
          step={0.01}
          value={baseValue.toFixed(FRACTION_DIGITS)}
          onChange={(event) => {
            const nextBaseValue =
              Number.parseFloat(event.target.value) || 0;

            const nextQuoteValue = nextBaseValue * rate;

            setBaseValue(nextBaseValue);
            setQuoteValue(nextQuoteValue);
          }}
        />
      </div>
      <div>
        <label
          style={{ display: 'block', width: '100%' }}
          htmlFor={quoteId}
        >
          {quoteCode}
        </label>
        <input
          id={quoteId}
          type="number"
          min={0}
          step={0.01}
          value={quoteValue.toFixed(FRACTION_DIGITS)}
          onChange={(event) => {
            const nextQuoteValue =
              Number.parseFloat(event.target.value) || 0;

            const nextBaseValue = nextQuoteValue / rate;

            setBaseValue(nextBaseValue);
            setQuoteValue(nextQuoteValue);
          }}
        />
      </div>
    </div>
  );
};
