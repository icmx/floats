import { useCallback, useEffect, useMemo } from 'react';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { parseSearch, buildSearch } from '../lib/search';
import { usePersistQueryParams } from '../stores/persistQueryParamsStore';
import { type QueryParams } from '../types';

export type UseQueryParams = {
  queryParams: QueryParams;
  setQueryParams: (queryParams: QueryParams) => void;
};

export const useQueryParams = (): UseQueryParams => {
  const [locationSearch, setLocationSearch] = useLocationSearch();
  const { setPersistQueryParams } = usePersistQueryParams();

  const prevQueryParams = useMemo(() => {
    return parseSearch(locationSearch);
  }, [locationSearch]);

  const setQueryParams = useCallback(
    (nextQueryParams: QueryParams) => {
      const search = buildSearch(nextQueryParams);

      setLocationSearch(search, { replace: true });
    },
    [setLocationSearch]
  );

  // @todo: maybe this should be moved somewhere, not sure
  useEffect(() => {
    if (locationSearch) {
      setPersistQueryParams(prevQueryParams);
    }
  }, [locationSearch, prevQueryParams, setPersistQueryParams]);

  return {
    queryParams: prevQueryParams,
    setQueryParams,
  };
};
