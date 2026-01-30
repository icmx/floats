import { type FunctionComponent } from 'react';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import {
  Plotter,
  type Series,
} from '../../components/currency/Plotter';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useCurrencies } from '../../stores/currenciesStore';
import type { Currency } from '../../types/currency';

type Data = {
  series: Series;
};

const toData = (currencies: Currency[]): Data => {
  const data: Data = { series: [] };

  currencies.forEach((currency) => {
    data.series.push({
      name: `${currency.baseCode}${currency.quoteCode}`,
      data: [...currency.data],
    });
  });

  return data;
};

export const ChartPage: FunctionComponent = () => {
  const { errors, currencies } = useCurrencies();

  const error = errors.at(0) || null;
  const data = toData(currencies);

  return (
    <>
      <SymbolChips />

      {error && <ErrorCallout error={error} />}

      <Plotter series={data.series} />
    </>
  );
};
