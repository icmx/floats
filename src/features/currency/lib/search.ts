import type { QueryParams } from '../types';

// @todo: make this code more common and reusable

const SEPARATOR = ',';

export const parseSearch = (search: string): QueryParams => {
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

export const buildSearch = (record: QueryParams): string => {
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

export const split = (value: string): string[] => {
  if (!value) {
    return [];
  }

  return value
    .trim()
    .split(SEPARATOR)
    .map((entry) => entry.trim())
    .filter((entry) => !!entry);
};

export const join = (value: string[]): string => {
  if (value.length === 0) {
    return '';
  }

  return value
    .map((entry) => entry.trim())
    .filter((entry) => !!entry)
    .join(SEPARATOR);
};
