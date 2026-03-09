import type { ThemeValue } from '../types/common';

export const THEMES: { value: ThemeValue; children: string }[] = [
  { value: 'system', children: 'System' },
  { value: 'light', children: 'Light' },
  { value: 'dark', children: 'Dark' },
];

export const LOCALES = navigator?.languages || ['en'];

export const EXPLORE_FRACTION_DIGITS = 6;

export const CONVERT_FRACTION_DIGITS = 2;
