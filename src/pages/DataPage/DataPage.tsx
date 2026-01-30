import { type FunctionComponent } from 'react';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { useSymbolsFromQueryParam } from '../../hooks/useSymbolsFromQueryParam';
import { useFractionDigits } from '../../stores/fractionDigitsStore';
import { useCurrencies } from '../../stores/currenciesStore';
import type { Currency } from '../../types/currency';

type Data = {
  head: string[];
  body: {
    date: number;
    rates: (number | null)[];
  }[];
};

const toData = (currencies: Currency[]): Data => {
  const headers = currencies.map((currency) => {
    return `${currency.baseCode}${currency.quoteCode}`;
  });

  const head = ['date', ...headers];

  const ratesByDates = new Map<number, (number | null)[]>();
  const SIZE = currencies.length;

  currencies.forEach((currency, index) => {
    currency.data.forEach(([date, rate]) => {
      const ratesByDate =
        ratesByDates.get(date) || new Array(SIZE).fill(null);

      ratesByDate[index] = rate;

      ratesByDates.set(date, ratesByDate);
    });
  });

  const body: { date: number; rates: (number | null)[] }[] = [];

  Array.from(ratesByDates.entries())
    .sort(([prev], [next]) => {
      return prev - next;
    })
    .forEach(([date, rates]) => {
      body.push({ date, rates });
    });

  const data: Data = {
    head,
    body,
  };

  return data;
};

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

  const { error: paramError } = useSymbolsFromQueryParam();
  const { errors: storeErrors, currencies } = useCurrencies();

  const error = paramError || storeErrors.at(0) || null;
  const data = toData(currencies);

  const { head, body } = data;

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
