import { useEffect, useMemo } from 'react';
import { loadCurrenciesToStore } from '../stores/currenciesStore';
import { isSymbolString } from '../utils/currency';
import { useQueryParams } from './useQueryParams';

export const useQueryParamsSync = (): void => {
  const { by } = useQueryParams();

  const symbols = useMemo(() => {
    return by.filter((value) => {
      return isSymbolString(value);
    });
  }, [by]);

  useEffect(() => {
    loadCurrenciesToStore(symbols);
  }, [symbols]);
};
