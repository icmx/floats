import type { ThemeValue } from './types';

// @todo: This file must be split

export const API_BASE_URL = import.meta.env.BUNDLE_API_BASE_URL;

export const THEMES: { value: ThemeValue; children: string }[] = [
  { value: 'system', children: 'System' },
  { value: 'light', children: 'Light' },
  { value: 'dark', children: 'Dark' },
];

export const LOCALES = navigator?.languages || ['en'];
