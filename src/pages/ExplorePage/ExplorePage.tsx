import { useEffect, useRef, type FunctionComponent } from 'react';
import { Alert } from '../../components/common/Alert';
import { Loading } from '../../components/common/Loading';
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
import { ErrorsFragment } from '../../components/currency/ErrorsFragment';
import { EmptyFragment } from '../../components/currency/EmptyFragment';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useCurrencies } from '../../stores/currency/currenciesStore';
import type {
  Currency,
  DateNumber,
  RateNumber,
  SymbolString,
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
