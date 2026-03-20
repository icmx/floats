import { useMemo } from 'react';
import { useMatches, type UIMatch } from 'react-router';

type RouteHandle = {
  title?: string;
};

// @todo: provide selected currencies
export const useTitle = (): string => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];

  const title = useMemo(() => {
    return matches
      .map((match) => match.handle?.title || '')
      .filter((entry) => !!entry)
      .reverse()
      .join(' - ');
  }, [matches]);

  return title;
};
