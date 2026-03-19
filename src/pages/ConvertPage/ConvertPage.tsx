import { type FunctionComponent } from 'react';
import { Link } from 'react-router';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyAlert } from '../../components/common/EmptyAlert';
import { Loading } from '../../components/common/Loading';
import { Converter } from '../../components/currency/Converter';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useCurrencies } from '../../stores/currenciesStore';
import type { CodeString, Currency } from '../../types/currency';
import { extractCurrencyCodes } from '../../utils/currency';

export type Data = {
  rates: {
    symbol: [CodeString, CodeString];
    rate: number;
  }[];
};

const toData = (currencies: Currency[]): Data => {
  const data: Data = {
    rates: currencies.map((currency) => {
      const [baseCode, quoteCode] = extractCurrencyCodes(currency);

      return {
        symbol: [baseCode, quoteCode],
        rate: currency.body.at(-1)?.[1] || 0,
      };
    }),
  };

  return data;
};

export const ConvertPage: FunctionComponent = () => {
  const { currencies, isLoading, errors } = useCurrencies();

  const data = toData(currencies);

  const error = errors.at(0) || null;
  const empty = !error && currencies.length === 0;

  return (
    <>
      <SymbolChips />

      {isLoading && <Loading />}

      {error && <ErrorAlert error={error} />}

      {empty && (
        <EmptyAlert>
          <p>No symboles are selected to show.</p>
          <p>
            Try <Link to={'?by=USDEUR'}>USDEUR</Link> for instance.
          </p>
        </EmptyAlert>
      )}

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
