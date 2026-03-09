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
import styles from './ExplorePage.module.css';

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

export const ExplorePage: FunctionComponent = () => {
  const { errors, currencies } = useCurrencies();

  const error = errors.at(0) || null;

  const chartData = toChartData(currencies);
  const tableData = toTableData(currencies);

  return (
    <>
      {error && <ErrorCallout error={error} />}

      <div className={styles.Group}>
        <div className={styles.Panel}>
          <SymbolChips />
          {chartData.series?.length > 0 && (
            <DataChart series={chartData.series} />
          )}
        </div>

        <div className={styles.Panel}>
          <DataTable
            colDefs={[
              createDateColDef(),
              ...tableData.head.slice(1).map((symbol) => {
                return createRateColDef(symbol);
              }),
            ]}
            rows={tableData.body}
          />
        </div>
      </div>
    </>
  );
};
