import { LOCALES } from './constants';
import {
  EXPLORE_FRACTION_DIGITS,
  CONVERT_FRACTION_DIGITS,
} from './features/currency/constants';
import type { QueryParams } from './types';

// @todo: This file must be split into separate shared libs

export class ApiCache<T> {
  private _entries: Map<string, Promise<T>>;

  constructor() {
    this._entries = new Map();
  }

  get(key: string): Promise<T> | null {
    return this._entries.get(key) ?? null;
  }

  set(key: string, value: Promise<T>): void {
    this._entries.set(key, value);
  }

  resolve(key: string, onMiss: () => Promise<T>): Promise<T> {
    const existing = this.get(key);

    if (existing) {
      return existing;
    }

    const missing = onMiss().catch((rejected) => {
      this._entries.delete(key);

      throw rejected;
    });

    this.set(key, missing);

    return missing;
  }
}

export const classNames = (
  init: string | (false | string)[] | Record<string, boolean>
): string => {
  if (!init) {
    return '';
  }

  if (typeof init === 'string') {
    return init.trim();
  }

  if (Array.isArray(init)) {
    return classNames(
      init
        .filter((i): i is string => {
          return typeof i === 'string' && !!i;
        })
        .map((i) => {
          return i.trim();
        })
        .join(' ')
    );
  }

  if (typeof init === 'object') {
    const keys = Array.from(Object.entries(init))
      .filter(([, value]) => {
        return !!value;
      })
      .map(([key]) => {
        return key;
      });

    return classNames(keys);
  }

  throw new Error('Unable to process class names');
};

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

const SEPARATOR = ',';

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

const exploreFormatter = new Intl.NumberFormat(LOCALES, {
  maximumFractionDigits: EXPLORE_FRACTION_DIGITS,
  minimumFractionDigits: EXPLORE_FRACTION_DIGITS,
  roundingMode: 'halfEven',
});

const convertFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: CONVERT_FRACTION_DIGITS,
  minimumFractionDigits: CONVERT_FRACTION_DIGITS,
  roundingMode: 'halfEven',
  useGrouping: false,
});

export const formatToIsodate = (dateInit: string | number): string => {
  return new Date(dateInit).toISOString().slice(0, 10);
};

export const formatToIsodatetime = (
  dateInit: string | number
): string => {
  return new Date(dateInit).toJSON().slice(0, 16).replace('T', ' ');
};

export const formatToExploreNumber = (numberInit: number): string => {
  return exploreFormatter.format(numberInit);
};

export const formatToConvertNumber = (numberInit: number): string => {
  const parts = convertFormatter.formatToParts(numberInit);

  return parts.reduce((result, { type, value }) => {
    if (type === 'integer') {
      return `${result}${value}`;
    }

    if (type === 'decimal') {
      return `${result}.`;
    }

    if (type === 'fraction') {
      return `${result}${value}`;
    }

    return result;
  }, '');
};
