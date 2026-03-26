import { useEffect, useMemo } from 'react';
import { loadCurrenciesStore } from '../stores/currency/currenciesStore';
import { isSymbolString } from '../utils/currency';
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
