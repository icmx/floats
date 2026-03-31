import type { FunctionComponent } from 'react';
import { Alert } from '../../components/Alert';
import { Loading } from '../../components/Loading';
import { Converter } from '../../features/currency/components/Converter';
import { EmptyFragment } from '../../features/currency/components/EmptyFragment';
import { ErrorsFragment } from '../../features/currency/components/ErrorsFragment';
import { SymbolChips } from '../../features/currency/components/SymbolChips';
import { useCurrencies } from '../../features/currency/stores/currenciesStore';
import type {
  CodeString,
  Currency,
} from '../../features/currency/types';
import { extractCurrencyCodes } from '../../features/currency/utils';

export type ConvertersData = {
  rates: {
    symbol: [CodeString, CodeString];
    rate: number;
  }[];
};

const toData = (currencies: Currency[]): ConvertersData => {
  const data: ConvertersData = {
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
  const { isLoading, errors, entries } = useCurrencies();

  const data = toData(entries);

  const hasErrors = errors.length > 0;
  const hasEntries = entries.length > 0;

  const shouldShowLoading = isLoading && !hasEntries;
  const shouldShowErrors = hasErrors;
  const shouldShowEmpty = !isLoading && !hasErrors && !hasEntries;
  const shouldShowEntries = hasEntries;

  return (
    <>
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
      )}
    </>
  );
};
