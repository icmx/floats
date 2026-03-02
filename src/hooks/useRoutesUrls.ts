import { useMemo } from 'react';
import { usePersistQueryParams } from '../stores/persistQueryParamsStore';
import { buildSearch } from '../utils/common';
import { useQueryParams } from './useQueryParams';

export type UseRoutesUrls = {
  chart: string;
  convert: string;
  data: string;
};

export const useRoutesUrls = (): UseRoutesUrls => {
  const { queryParams } = useQueryParams();
  const { persistQueryParams } = usePersistQueryParams();

  const search = useMemo(() => {
    return buildSearch(queryParams) || buildSearch(persistQueryParams);
  }, [queryParams, persistQueryParams]);

  return {
    chart: `/chart${search}`,
    convert: `/convert${search}`,
    data: `/data${search}`,
  };
};
