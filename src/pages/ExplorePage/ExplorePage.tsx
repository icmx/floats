import { type FunctionComponent } from 'react';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Chart, type Series } from '../../components/currency/Chart';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useCurrencies } from '../../stores/currenciesStore';
import type { Currency } from '../../types/currency';
import { exploreFormatter } from '../../utils/currency';
import { DataGrid } from '../../components/common/DataGrid';

type ChartData = {
  series: Series;
};

const toChartData = (currencies: Currency[]): ChartData => {
  const data: ChartData = { series: [] };

  currencies.forEach((currency) => {
    data.series.push({
      name: `${currency.baseCode}${currency.quoteCode}`,
      data: [...currency.data],
    });
  });

  return data;
};

type TableData = {
  head: string[];
  body: {
    date: number;
    rates: (number | null)[];
  }[];
};

const toTableData = (currencies: Currency[]): TableData => {
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

  const data: TableData = {
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
}> = ({ value }) => {
  const text = value === null ? '' : exploreFormatter.format(value);

  return <data value={value ?? undefined}>{text}</data>;
};

export const ExplorePage: FunctionComponent = () => {
  const { errors, currencies } = useCurrencies();

  const error = errors.at(0) || null;

  const chartData = toChartData(currencies);
  const tableData = toTableData(currencies);

  const symbolCols = tableData.head.slice(1);

  return (
    <>
      <SymbolChips />

      {error && <ErrorCallout error={error} />}

      {/* @todo: handle empty state gracefully */}
      {chartData.series?.length > 0 && (
        <Chart series={chartData.series} />
      )}

      <DataGrid<{ date: number; [c: string]: number }>
        colDefs={{
          date: {
            title: 'Date',
            format: (value) => {
              return new Date(value).toISOString().slice(0, 10);
            },
          },
          ...Object.fromEntries(
            symbolCols.map((col) => {
              return [
                col,
                {
                  title: col,
                  format: (value) => {
                    if (!value) {
                      return '';
                    }

                    return exploreFormatter.format(value);
                  },
                },
              ];
            })
          ),
        }}
        rowDef={{
          key: (row) => {
            return row.date.toString();
          },
        }}
        rows={tableData.body.map((row) => {
          return {
            date: row.date,
            ...Object.fromEntries(
              row.rates.map((rate, i) => {
                return [symbolCols[i], rate];
              })
            ),
          };
        })}
      />
    </>
  );
};
