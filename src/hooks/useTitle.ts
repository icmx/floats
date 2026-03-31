import { useMemo } from 'react';
import { useMatches, type UIMatch } from 'react-router';
import type { RouteHandle } from '../types';
import { useQueryParams } from './useQueryParams';

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
