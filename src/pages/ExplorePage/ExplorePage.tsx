import { useEffect, useRef, type FunctionComponent } from 'react';
import { Link } from 'react-router';
import { EmptyAlert } from '../../components/common/EmptyAlert';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import {
  DataChart,
  type DataChartHandle,
  type DataChartProps,
} from '../../components/currency/DataChart';
import {
  DataTable,
  type DataRow,
  type DataTableHandle,
  type DataTableProps,
} from '../../components/currency/DataTable';
import {
  createDateCell,
  createDateColDef,
  createRateCell,
  createRateColDef,
} from '../../components/currency/DataTable/DataTable.utils';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useCurrencies } from '../../stores/currenciesStore';
import type { Currencies, Currency } from '../../types/currency';
import styles from './ExplorePage.module.css';

const toChartData = (currencies: Currency[]): DataChartProps => {
  const data: DataChartProps = { series: [] };

  currencies.forEach((currency) => {
    data.series.push({
      name: currency.head[1],
      data: [...currency.body],
    });
  });

  return data;
};

const toTableData = (currencies: Currency[]): DataTableProps => {
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

  return {
    colDefs: head.map((cell, index) => {
      if (index === 0) {
        return createDateColDef();
      }

      return createRateColDef(cell);
    }),
    rows: body.map((row) => {
      return row.map((cell, index) => {
        if (index === 0) {
          return createDateCell(row[0]);
        }

        return createRateCell(cell);
      });
    }) as DataRow[],
  };
};

export const ExplorePage: FunctionComponent = () => {
  const { currencies, errors } = useCurrencies();

  const chartRef = useRef<DataChartHandle>(null);
  const tableRef = useRef<DataTableHandle>(null);

  useEffect(() => {
    chartRef.current?.scrollToRecent();
    tableRef.current?.scrollToRecent();
  }, [currencies]);

  const chartData = toChartData(currencies);
  const tableData = toTableData(currencies);

  const error = errors.at(0) || null;
  const empty = !error && currencies.length === 0;

  const shouldShowTable = !error && !empty;
  const shouldShowChart = !error && !empty;

  return (
    <>
      <div className={styles.Group}>
        <div className={styles.Panel}>
          <SymbolChips />

          {error && <ErrorAlert error={error} />}

          {empty && (
            <EmptyAlert>
              <p>No symboles are selected to show.</p>
              <p>
                Try <Link to={'?by=USDEUR'}>USDEUR</Link> for instance.
              </p>
            </EmptyAlert>
          )}

          {shouldShowChart && (
            <DataChart ref={chartRef} {...chartData} />
          )}
        </div>

        <div className={styles.Panel}>
          {shouldShowTable && (
            <DataTable ref={tableRef} {...tableData} />
          )}
        </div>
      </div>
    </>
  );
};
