import { useEffect, useState, type FunctionComponent } from 'react';
import { LineField } from '@/components/LineField';
import { formatToRealCurrencyNumber } from '@/lib/format';
import { type ConverterProps } from './Converter.types';
import styles from './Converter.module.css';

export const Converter: FunctionComponent<ConverterProps> = ({
  baseAmount,
  baseCode,
  quoteCode,
  rate,
}) => {
  const [baseValue, setBaseValue] = useState(baseAmount);
  const quoteValue = baseValue * rate;

  useEffect(() => {
    setBaseValue(baseAmount);
  }, [baseAmount]);

  const baseId = `input-base-${baseCode}`;
  const quoteId = `input-quote-${quoteCode}`;

  return (
    <div className={styles.Converter}>
      <LineField
        id={baseId}
        label={baseCode}
        type="number"
        min={0}
        step={0.01}
        value={formatToRealCurrencyNumber(baseValue)}
        onChange={(event) => {
          const value = Number.parseFloat(event.target.value) || 0;

          setBaseValue(Math.max(0, value));
        }}
      />

      <LineField
        id={quoteId}
        label={quoteCode}
        type="number"
        min={0}
        step={0.01}
        value={formatToRealCurrencyNumber(quoteValue)}
        onChange={(event) => {
          const value = Number.parseFloat(event.target.value) || 0;
          const nextBaseValue = rate > 0 ? value / rate : 0;

          setBaseValue(Math.max(0, nextBaseValue));
        }}
      />
    </div>
  );
};
