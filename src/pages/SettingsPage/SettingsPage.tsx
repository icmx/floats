import { type FunctionComponent, type ReactNode } from 'react';
import { BoxField } from '../../components/BoxField';
import { useThemeValue } from '../../stores/themeValueStore';
import type { ThemeValue } from '../../types/themes';

const THEMES: { value: ThemeValue; children: ReactNode }[] = [
  { value: 'system', children: 'System' },
  { value: 'light', children: 'Light' },
  { value: 'dark', children: 'Dark' },
];

export const SettingsPage: FunctionComponent = () => {
  const [themeValue, setThemeValue] = useThemeValue();

  return (
    <>
      <h2>Theme</h2>
      <form>
        {THEMES.map((theme) => {
          const id = `input-theme-${theme.value}`;

          return (
            <BoxField
              key={id}
              id={id}
              label={theme.children}
              type="radio"
              name="theme"
              checked={theme.value === themeValue}
              value={theme.value}
              onChange={() => {
                setThemeValue(theme.value);
              }}
            />
          );
        })}
      </form>
    </>
  );
};
