import type { ThemeValue } from './types';

export const THEMES: { value: ThemeValue; children: string }[] = [
  { value: 'system', children: 'System' },
  { value: 'light', children: 'Light' },
  { value: 'dark', children: 'Dark' },
];

export const LOCALES = navigator?.languages || ['en'];
