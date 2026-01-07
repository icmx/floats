import type { FunctionComponent } from 'react';
import { useDataPageData } from '../../api/client';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';

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
  // @todo: mini cards
  // const symbolCards = useSymbolCards();

  const [fractionDigits] = useFractionDigits();
  const { head, body } = useDataPageData();

  return (
    <>
      <title>floats - Data</title>
      <p>Data Page</p>

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
