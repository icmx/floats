import { type FunctionComponent } from 'react';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import {
  DataChart,
  type Series,
} from '../../components/currency/DataChart';
import { DataTable } from '../../components/currency/DataTable';
import {
  createDateColDef,
  createRateColDef,
} from '../../components/currency/DataTable/DateTable.utils';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useCurrencies } from '../../stores/currenciesStore';
import type { Currencies, Currency } from '../../types/currency';
import { exploreFormatter } from '../../utils/common';

type ChartData = {
  series: Series;
};

const toChartData = (currencies: Currency[]): ChartData => {
  const data: ChartData = { series: [] };

  currencies.forEach((currency) => {
    data.series.push({
      name: currency.head[1],
      data: [...currency.body],
    });
  });

  return data;
};

const toTableData = (currencies: Currency[]): Currencies => {
  const head: Currencies['head'] = ['date'];
  const body: Currencies['body'] = [];

  const ratesByDates = new Map<number, (number | null)[]>();
  const SIZE = currencies.length;

  currencies.forEach((currency, index) => {
    head.push(currency.head[1]);

    currency.body.forEach(([date, rate]) => {
      const ratesByDate =
        ratesByDates.get(date) || new Array(SIZE).fill(null);

      ratesByDate[index] = rate;

      ratesByDates.set(date, ratesByDate);
    });
  });

  Array.from(ratesByDates.entries())
    .sort(([prev], [next]) => {
      return prev - next;
    })
    .forEach(([date, rates]) => {
      body.push([date, ...rates]);
    });

  return { head, body };
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
        <DataChart series={chartData.series} />
      )}

      <DataTable
        colDefs={[
          createDateColDef(),
          ...tableData.head.slice(1).map((symbol) => {
            return createRateColDef(symbol);
          }),
        ]}
        rows={tableData.body}
      />
    </>
  );
};
