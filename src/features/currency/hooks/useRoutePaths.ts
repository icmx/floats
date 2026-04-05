import { useMemo } from 'react';
import { PATHS } from '@/config/paths';
import { buildSearch } from '../lib/search';
import { usePersistQueryParams } from '../stores/persistQueryParamsStore';
import { useQueryParams } from './useQueryParams';

export type UseRoutePaths = {
  explore: string;
  convert: string;
};

export const useRoutePaths = (): UseRoutePaths => {
  const { queryParams } = useQueryParams();
  const { persistQueryParams } = usePersistQueryParams();

  const search = useMemo(() => {
    return buildSearch(queryParams) || buildSearch(persistQueryParams);
  }, [queryParams, persistQueryParams]);

  return {
    explore: `${PATHS.pages.explore.path}${search}`,
    convert: `${PATHS.pages.convert.path}${search}`,
  };
};
