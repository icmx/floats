import { useCallback, useMemo } from 'react';
import { useLocationSearch } from './useLocationSearch';

export type QueryParams = {
  by: string[];
};

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

const parseSearch = (search: string): QueryParams => {
  const record: QueryParams = { by: [] };

  if (!search || search === '?') {
    return record;
  }

  Array.from(new URLSearchParams(search).entries()).forEach(
    ([key, value]) => {
      if (key === 'by') {
        record[key] = split(value);
      }
    }
  );

  return record;
};

const buildSearch = (record: QueryParams): string => {
  const entries: [string, string][] = [];

  if (record.by.length > 0) {
    entries.push(['by', join(record.by)]);
  }

  if (entries.length === 0) {
    return '';
  }

  const params = entries
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join('&');

  return `?${params}`;
};

const SEPARATOR = ',';

const split = (value: string): string[] => {
  if (!value) {
    return [];
  }

  return value
    .trim()
    .split(SEPARATOR)
    .map((entry) => entry.trim())
    .filter((entry) => !!entry);
};

const join = (value: string[]): string => {
  if (value.length === 0) {
    return '';
  }

  return value
    .map((entry) => entry.trim())
    .filter((entry) => !!entry)
    .join(SEPARATOR);
};
