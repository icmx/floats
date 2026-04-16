import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { type DateNumber, type RateNumber } from '../../../types';
import { type ColDef, type DataRow } from '../DataTable.types';
import { XSizingRow } from './XSizingRow';

const createDateNumber = (
  year: number,
  month: number,
  day: number
): DateNumber => {
  return Date.UTC(year, month - 1, day) as DateNumber;
};

const createRateNumber = (value: number | null): RateNumber => {
  return value as RateNumber;
};

const colDefs: ColDef[] = [
  { key: 'date', displayType: 'date', label: 'Date' },
  { key: 'EURUSD', displayType: 'rate', label: 'EURUSD' },
  { key: 'USDJPY', displayType: 'rate', label: 'USDJPY' },
];

const rows: DataRow[] = [
  [
    { value: createDateNumber(2020, 1, 1), displayValue: '202-01-01' },
    { value: createRateNumber(1.5), displayValue: '1.50' },
    { value: createRateNumber(100.123), displayValue: '100.12' },
  ],
  [
    { value: createDateNumber(2020, 1, 2), displayValue: '202-01-02' },
    { value: createRateNumber(200.99), displayValue: '200.99' },
    { value: createRateNumber(50.0), displayValue: '50.00' },
  ],
];

const renderToTable = (ui: React.ReactElement) => {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );
};

describe('XSizingRow', () => {
  it('should render row with one cell for each colDef', () => {
    const { container } = renderToTable(
      <XSizingRow colDefs={colDefs} rows={rows} />
    );

    const cells = container.querySelectorAll('td');

    expect(cells).toHaveLength(3);
  });

  it('should render "0000-00-00" for the first (date) column', () => {
    const { container } = renderToTable(
      <XSizingRow colDefs={colDefs} rows={rows} />
    );

    const cells = container.querySelectorAll('td');

    expect(cells[0].textContent).toBe('0000-00-00');
  });

  it('should render displayValue of the max value for rate columns', () => {
    const { container } = renderToTable(
      <XSizingRow colDefs={colDefs} rows={rows} />
    );

    const cells = container.querySelectorAll('td');

    // EURUSD: max is 200.99 = '200.99'
    expect(cells[1].textContent).toBe('200.99');

    // USDJPY: max is 100.123 = '100.12'
    expect(cells[2].textContent).toBe('100.12');
  });

  it('should render empty string for rate columns when all values are null', () => {
    const nullRows: DataRow[] = [
      [
        {
          value: createDateNumber(2025, 1, 1),
          displayValue: '2025-01-01',
        },
        { value: null, displayValue: '' },
      ],
    ];

    const singleColDefs: ColDef[] = [
      { key: 'date', displayType: 'date', label: 'Date' },
      { key: 'EURUSD', displayType: 'rate', label: 'EURUSD' },
    ];

    const { container } = renderToTable(
      <XSizingRow colDefs={singleColDefs} rows={nullRows} />
    );

    const cells = container.querySelectorAll('td');

    expect(cells[1].textContent).toBe('');
  });
});
