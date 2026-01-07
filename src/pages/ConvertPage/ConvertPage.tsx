import { useState, type FunctionComponent } from 'react';
import { useConvertPageData } from '../../api/client';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';

export const ConvertPage: FunctionComponent = () => {
  const [fractionDigits] = useFractionDigits();

  const convertPageData = useConvertPageData();
  const { symbol, rate } = convertPageData || {};

  const [baseValue, setBaseValue] = useState('1');
  const [quoteValue, setQuoteValue] = useState('0');

  return (
    <>
      <title>floats - Convert</title>

      <p>
        {symbol}: {rate?.toFixed(fractionDigits)}
      </p>

      {rate && (
        <form>
          <input
            type="number"
            min={0}
            step={0.01}
            value={baseValue}
            onChange={(event) => {
              const { value } = event.target;

              const baseValue = Number.parseFloat(value);

              if (Number.isNaN(baseValue)) {
                return;
              }

              const quoteValue = baseValue * rate;

              setBaseValue(baseValue.toFixed(2));
              setQuoteValue(quoteValue.toFixed(2));
            }}
          />

          <input
            type="number"
            min={0}
            step={0.01}
            value={quoteValue}
            onChange={(event) => {
              const { value } = event.target;

              const quoteValue = Number.parseFloat(value);

              if (Number.isNaN(quoteValue)) {
                return;
              }

              const baseValue = quoteValue / rate;

              setBaseValue(baseValue.toFixed(2));
              setQuoteValue(quoteValue.toFixed(2));
            }}
          />
        </form>
      )}
    </>
  );
};
