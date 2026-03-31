import { useEffect, useMemo } from 'react';
import { loadCurrenciesStore } from '../features/currency/stores/currenciesStore';
import { isSymbolString } from '../features/currency/utils';
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
