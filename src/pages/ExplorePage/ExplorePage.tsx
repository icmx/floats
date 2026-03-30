import { type FunctionComponent, useRef, useEffect } from 'react';
import { Alert } from '../../components/Alert';
import { Loading } from '../../components/Loading';
import {
  type DataChartHandle,
  type DataChartProps,
  DataChart,
} from '../../features/currency/components/DataChart';
import {
  type DataRow,
  type DataTableProps,
  type DataTableHandle,
  createDateCell,
  createDateColDef,
  createRateCell,
  createRateColDef,
  DataTable,
} from '../../features/currency/components/DataTable';
import { EmptyFragment } from '../../features/currency/components/EmptyFragment';
import { ErrorsFragment } from '../../features/currency/components/ErrorsFragment';
import { SymbolChips } from '../../features/currency/components/SymbolChips';
import { useCurrencies } from '../../stores/currency/currenciesStore';
import type {
  Currency,
  SymbolString,
  DateNumber,
  RateNumber,
} from '../../types/currency';
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
  const head: ['date', ...SymbolString[]] = ['date'];
  const body: [DateNumber, ...RateNumber[]][] = [];

  const ratesByDates = new Map<DateNumber, RateNumber[]>();
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
    rows: body.map((row): DataRow => {
      const [dateCell, ...rateCells] = row;

      return [
        createDateCell(dateCell),
        ...rateCells.map((rateCell) => {
          return createRateCell(rateCell);
        }),
      ];
    }),
  };
};

export const ExplorePage: FunctionComponent = () => {
  const chartRef = useRef<DataChartHandle>(null);
  const tableRef = useRef<DataTableHandle>(null);

  const { isLoading, errors, entries } = useCurrencies();

  useEffect(() => {
    chartRef.current?.scrollToRecent();
    tableRef.current?.scrollToRecent();
  }, [entries]);

  const chartData = toChartData(entries);
  const tableData = toTableData(entries);

  const hasErrors = errors.length > 0;
  const hasEntries = entries.length > 0;

  const shouldShowLoading = isLoading && !hasEntries;
  const shouldShowErrors = hasErrors;
  const shouldShowEmpty = !isLoading && !hasErrors && !hasEntries;
  const shouldShowEntries = hasEntries;

  return (
    <>
      <div className={styles.Group}>
        <div className={styles.Panel}>
          <SymbolChips />

          {shouldShowLoading && <Loading />}

          {shouldShowErrors && (
            <Alert status="failure">
              <ErrorsFragment errors={errors} />
            </Alert>
          )}

          {shouldShowEmpty && (
            <Alert status="default">
              <EmptyFragment />
            </Alert>
          )}

          {shouldShowEntries && (
            <DataChart ref={chartRef} {...chartData} />
          )}
        </div>

        <div className={styles.Panel}>
          {shouldShowEntries && (
            <DataTable ref={tableRef} {...tableData} />
          )}
        </div>
      </div>
    </>
  );
};
