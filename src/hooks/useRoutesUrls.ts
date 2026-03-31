import { useMemo } from 'react';
import { usePersistQueryParams } from '../features/currency/stores/persistQueryParamsStore';
import { buildSearch } from '../utils';
import { useQueryParams } from './useQueryParams';

export type UseRoutesUrls = {
  explore: string;
  convert: string;
};

export const useRoutesUrls = (): UseRoutesUrls => {
  const { queryParams } = useQueryParams();
  const { persistQueryParams } = usePersistQueryParams();

  const search = useMemo(() => {
    return buildSearch(queryParams) || buildSearch(persistQueryParams);
  }, [queryParams, persistQueryParams]);

  return {
    explore: `/explore${search}`,
    convert: `/convert${search}`,
  };
};
