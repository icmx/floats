import { useEffect, type FunctionComponent } from 'react';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';
import { useSymbolsFromQueryParam } from '../../hooks/useSymbolsFromQueryParam';
import { usePageStore } from './DataPage.store';

export const DateValue: FunctionComponent<{ value: number }> = ({
  value,
}) => {
  const dateTime = new Date(value).toJSON().substring(0, 10);

  return <time dateTime={dateTime}>{dateTime}</time>;
};

export const FloatValue: FunctionComponent<{
  value: number | null;
  fraction: number;
}> = ({ value, fraction }) => {
  const text = value === null ? '' : value.toFixed(fraction);

  return <data value={value ?? undefined}>{text}</data>;
};

export const DataPage: FunctionComponent = () => {
  const [fractionDigits] = useFractionDigits();
  const { symbols, error: paramError } = useSymbolsFromQueryParam();

  const { error: storeError, data } = usePageStore();
  const load = usePageStore((state) => state.load);

  const error = paramError || storeError || null;

  const { head, body } = data;

  useEffect(() => {
    load(symbols);
  }, [load, symbols]);

  return (
    <>
      <SymbolChips />

      {error && <ErrorCallout error={error} />}

      <table>
        <thead>
          <tr>
            {head.map((cell, index) => {
              return (
                <th
                  key={cell}
                  className={index === 0 ? 'align-left' : 'align-right'}
                >
                  {cell}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => {
            return (
              <tr key={row.date}>
                <th className="align-left">
                  <DateValue value={row.date} />
                </th>
                {row.rates.map((rate, index) => {
                  const key = `${row.date}_${head.at(index + 1)}`;

                  return (
                    <td key={key} className="align-right">
                      <FloatValue
                        value={rate}
                        fraction={fractionDigits}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
