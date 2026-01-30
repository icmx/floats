import { type FunctionComponent } from 'react';
import { Converter } from '../../components/currency/Converter';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Loading } from '../../components/common/Loading';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useSymbolsFromQueryParam } from '../../hooks/useSymbolsFromQueryParam';
import type { CodeString, Currency } from '../../types/currency';
import { useCurrencies } from '../../stores/currenciesStore';

export type Data = {
  rates: {
    symbol: [CodeString, CodeString];
    rate: number;
  }[];
};

const toData = (currencies: Currency[]): Data => {
  const data: Data = {
    rates: currencies.map((currency) => {
      return {
        symbol: [currency.baseCode, currency.quoteCode],
        rate: currency.data.at(-1)?.[1] || 0,
      };
    }),
  };

  return data;
};

export const ConvertPage: FunctionComponent = () => {
  const { error: paramError } = useSymbolsFromQueryParam();
  const {
    errors: storeErrors,
    currencies,
    isLoading,
  } = useCurrencies();

  const error = paramError || storeErrors.at(0) || null;
  const data = toData(currencies);

  return (
    <>
      <SymbolChips />

      {isLoading && <Loading />}

      {error && <ErrorCallout error={error} />}

      <form>
        {data.rates.map(({ symbol: [baseCode, quoteCode], rate }) => {
          return (
            <Converter
              key={`${baseCode}${quoteCode}`}
              baseAmount={1}
              baseCode={baseCode}
              quoteCode={quoteCode}
              rate={rate}
            />
          );
        })}
      </form>
    </>
  );
};
