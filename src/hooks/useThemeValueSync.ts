import { useEffect } from 'react';
import { useThemeValue } from '../stores/themeValueStore';
import type { ThemeValue } from '../types/themes';

type ResolvedThemeValue = Exclude<ThemeValue, 'system'>;

const QUERY = '(prefers-color-scheme: dark)';

const getMatchingThemeValue = (): ResolvedThemeValue => {
  return matchMedia(QUERY).matches ? 'dark' : 'light';
};

const resolveThemeValue = (
  themeValue: ThemeValue
): ResolvedThemeValue => {
  if (themeValue !== 'system') {
    return themeValue;
  }

  return getMatchingThemeValue();
};

const applyThemeValue = (themeValue: ThemeValue): void => {
  const dataset = document?.documentElement?.dataset || {};
  dataset.theme = themeValue;
};

export const useThemeValueSync = (): void => {
  const [themeValue] = useThemeValue();

  useEffect(() => {
    applyThemeValue(resolveThemeValue(themeValue));
  }, [themeValue]);

  useEffect(() => {
    if (themeValue !== 'system') {
      return;
    }

    const match = matchMedia(QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      applyThemeValue(event.matches ? 'dark' : 'light');
    };

    match.addEventListener('change', handleChange);

    return () => {
      match.removeEventListener('change', handleChange);
    };
  }, [themeValue]);
};
