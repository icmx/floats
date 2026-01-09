import { useEffect, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { fetchCurrenciesByNotation } from '../../api/client';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';
import { type AsyncPayload } from '../../types/common';
import { asError } from '../../utils/common';

type Data = {
  head: string[];
  body: {
    date: number;
    rates: (number | null)[];
  }[];
};

const usePageStore = create<
  AsyncPayload<Data> & { load: (notation: string) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { head: [], body: [] },
    load: async (notation) => {
      set({ isLoading: true });

      try {
        const currencies = await fetchCurrenciesByNotation(notation);
        const currency = currencies.at(0);

        if (!currency) {
          throw new Error('No currencies');
        }

        const symbols = currencies.map((currency) => {
          return `${currency.baseCode}${currency.quoteCode}`;
        });

        const head = ['date', ...symbols];

        const ratesByDates = new Map<number, (number | null)[]>();
        const SIZE = currencies.length;

        currencies.forEach((currency, index) => {
          currency.rates.forEach(({ date, rate }) => {
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
        set({ error: asError(error) });
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

  const [searchParams] = useSearchParams();
  const notation = searchParams.get('by') || '';

  const { error, data } = usePageStore();
  const load = usePageStore((state) => state.load);

  const { head, body } = data;

  useEffect(() => {
    load(notation);
  }, [notation, load]);

  return (
    <>
      <title>floats - Data</title>
      <p>Data Page</p>

      <SymbolChips href={(id) => `/data?by=${id}`} />

      {error && (
        <p>
          Error: <code>{JSON.stringify(error.message, null, 2)}</code>
        </p>
      )}

      <table>
        <thead>
          <tr>
            {head.map((cell) => {
              return <th key={cell}>{cell}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => {
            return (
              <tr key={row.date}>
                <th>
                  <DateValue value={row.date} />
                </th>
                {row.rates.map((rate, index) => {
                  const key = `${row.date}_${head.at(index + 1)}`;

                  return (
                    <td key={key}>
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
