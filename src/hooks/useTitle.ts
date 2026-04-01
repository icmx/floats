import { useMemo } from 'react';
import { useMatches, type UIMatch } from 'react-router';
import { useQueryParams } from '../features/currency/hooks/useQueryParams';
import type { QueryParams } from '../features/currency/types';

export type RouteHandle = {
  title?: ((queryParams: QueryParams) => string) | string;
};

export const createDynamicRouteHandleTitle = (
  title: string
): RouteHandle['title'] => {
  return (queryParams) => {
    const currencies = queryParams.by.join(', ');

    if (!currencies) {
      return title;
    }

    return `${currencies} - ${title}`;
  };
};

export const useTitle = (): string => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];
  const { queryParams } = useQueryParams();

  const title = useMemo(() => {
    return matches
      .map((match) => match.handle?.title || '')
      .filter((entry) => !!entry)
      .map((entry) => {
        if (typeof entry === 'function') {
          return entry(queryParams);
        }

        return entry;
      })
      .reverse()
      .join(' - ');
  }, [matches, queryParams]);

  return title;
};
