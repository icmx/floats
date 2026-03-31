import { useEffect, useMemo } from 'react';
import { isSymbolString } from '../features/currency/utils';
import { loadCurrenciesStore } from '../stores/currency/currenciesStore';
import { useQueryParams } from './useQueryParams';

export const useQueryParamsSync = (): void => {
  const { queryParams } = useQueryParams();
  const { by } = queryParams;

  const symbols = useMemo(() => {
    return by.filter((value) => {
      return isSymbolString(value);
    });
  }, [by]);

  useEffect(() => {
    loadCurrenciesStore(symbols);
  }, [symbols]);
};
