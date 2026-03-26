import { useState, type FunctionComponent } from 'react';
import { formatToConvertNumber } from '../../../utils/common';
import { LineField } from '../../common/LineField';
import type { ConverterProps } from './Converter.types';
import styles from './Converter.module.css';

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
      <LineField
        id={baseId}
        label={baseCode}
        type="number"
        min={0}
        step={0.01}
        value={formatToConvertNumber(baseValue)}
        onChange={(event) => {
          const nextBaseValue =
            Number.parseFloat(event.target.value) || 0;

          const nextQuoteValue = nextBaseValue * rate;

          setBaseValue(nextBaseValue);
          setQuoteValue(nextQuoteValue);
        }}
      />

      <LineField
        id={quoteId}
        label={quoteCode}
        type="number"
        min={0}
        step={0.01}
        value={formatToConvertNumber(quoteValue)}
        onChange={(event) => {
          const nextQuoteValue =
            Number.parseFloat(event.target.value) || 0;

          const nextBaseValue = nextQuoteValue / rate;

          setBaseValue(nextBaseValue);
          setQuoteValue(nextQuoteValue);
        }}
      />
    </div>
  );
};
