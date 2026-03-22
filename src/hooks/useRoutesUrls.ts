import { useMemo } from 'react';
import { usePersistQueryParams } from '../stores/currency/persistQueryParamsStore';
import { buildSearch } from '../utils/common';
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
