import { useEffect, useState, type FunctionComponent } from 'react';
import { LineField } from '../../components/common/LineField';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';
import {
  useThemeValue,
  type ThemeValue,
} from '../../hooks/useThemeValueStore';
import { BoxField } from '../../components/common/BoxField';

const THEMES: { value: ThemeValue; children: string }[] = [
  { value: 'system', children: 'System' },
  { value: 'light', children: 'Light' },
  { value: 'dark', children: 'Dark' },
];

export const SettingsPage: FunctionComponent = () => {
  const [themeValue, setThemeValue] = useThemeValue();

  const [fractionDigits, setFractionDigits] = useFractionDigits();

  const [resultDigit, setReultDigit] = useState('');

  useEffect(() => {
    setReultDigit(
      'Will show: ' + (1000.12345678).toFixed(fractionDigits)
    );
  }, [fractionDigits]);

  return (
    <>
      <form>
        <div>
          {THEMES.map((theme) => {
            const id = `input-theme-${theme.value}`;

            return (
              <BoxField
                key={id}
                id={id}
                label={theme.children}
                type="radio"
                checked={theme.value === themeValue}
                value={theme.value}
                onChange={() => {
                  setThemeValue(theme.value);
                }}
              />
            );
          })}
        </div>

        <LineField
          id="fraction-digit"
          label="Fraction Digits"
          type="number"
          min={0}
          max={8}
          step={1}
          value={fractionDigits}
          onChange={(event) => {
            const text = event.target.value;
            const int = Number.parseInt(text, 10);

            if (int < 0 || int > 8) {
              return;
            }

            setFractionDigits(int);
          }}
        />

        <output
          style={{
            fontFamily: 'monospace',
            backgroundColor: 'gray',
            display: 'block',
            padding: '1rem',
          }}
        >
          {resultDigit}
        </output>
      </form>
    </>
  );
};
