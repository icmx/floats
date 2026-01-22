import { useMemo } from 'react';
import { buildSearch } from '../utils/common';
import { useQueryParams } from './useQueryParams';

export type UseRoutesUrls = {
  chart: string;
  convert: string;
  data: string;
};

export const useRoutesUrls = (): UseRoutesUrls => {
  const { by } = useQueryParams();

  const search = useMemo(() => {
    return buildSearch({ by });
  }, [by]);

  return {
    chart: `/chart${search}`,
    convert: `/convert${search}`,
    data: `/data${search}`,
  };
};
