import { useEffect } from 'react';
import { loadCurrenciesToStore } from '../stores/currenciesStore';
import { useSymbolsFromQueryParam } from './useSymbolsFromQueryParam';

export const useSymbolsFromQueryParamSync = (): void => {
  const { symbols } = useSymbolsFromQueryParam();

  useEffect(() => {
    if (symbols.length) {
      loadCurrenciesToStore(symbols);
    }
  }, [symbols]);
};
