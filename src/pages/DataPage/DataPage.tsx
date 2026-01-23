import { useEffect, type FunctionComponent } from 'react';
import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';
import { useQueryParams } from '../../hooks/useQueryParams';
import { type AsyncPayload } from '../../types/common';
import { parseSymbolStringsToTuples } from '../../utils/currency';

type Data = {
  head: string[];
  body: {
    date: number;
    rates: (number | null)[];
  }[];
};

const usePageStore = create<
  AsyncPayload<Data> & { load: (symbols: string[]) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { head: [], body: [] },
    load: async (symbols) => {
      set({ isLoading: true });

      try {
        const tuples = parseSymbolStringsToTuples(symbols);
        const currencies = await fetchCurrenciesBySymbols(tuples);
        const currency = currencies.at(0);

        if (!currency) {
          throw new Error('No currencies');
        }

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

        set({ error: null, data });
      } catch (error) {
        set({ error });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

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

  const { by: symbols } = useQueryParams();

  const { error, data } = usePageStore();
  const load = usePageStore((state) => state.load);

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
