import { type FunctionComponent } from 'react';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import {
  Plotter,
  type Series,
} from '../../components/currency/Plotter';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useCurrencies } from '../../stores/currenciesStore';
import type { Currency } from '../../types/currency';
import { exploreFormatter } from '../../utils/currency';

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

  return (
    <>
      <SymbolChips />

      {error && <ErrorCallout error={error} />}

      {/* @todo: handle empty state gracefully */}
      {chartData.series?.length > 0 && (
        <Plotter series={chartData.series} />
      )}

      <table>
        <thead>
          <tr>
            {tableData.head.map((cell, index) => {
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
          {tableData.body.map((row) => {
            return (
              <tr key={row.date}>
                <th className="align-left">
                  <DateValue value={row.date} />
                </th>
                {row.rates.map((rate, index) => {
                  const key = `${row.date}_${tableData.head.at(
                    index + 1
                  )}`;

                  return (
                    <td key={key} className="align-right is-number">
                      <FloatValue value={rate} />
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
