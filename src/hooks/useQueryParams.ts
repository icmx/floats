import { useCallback, useMemo } from 'react';
import { useLocationSearch } from './useLocationSearch';
import type { QueryParams } from '../types/common';
import { buildSearch, parseSearch } from '../utils/common';

export type UseQueryParams = {
  by: string[];
  setBy: (value: string[]) => void;
};

export const useQueryParams = (): UseQueryParams => {
  const [locationSearch, setLocationSearch] = useLocationSearch();

  const params = useMemo(() => {
    return parseSearch(locationSearch);
  }, [locationSearch]);

  const setParams = useCallback(
    (value: QueryParams) => {
      const search = buildSearch(value);

      setLocationSearch(search);
    },
    [setLocationSearch]
  );

  const { by } = params;

  const setBy = useCallback(
    (value: string[]) => {
      setParams({ ...params, by: value });
    },
    [params, setParams]
  );

  return { by, setBy };
};
