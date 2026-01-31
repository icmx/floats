import { type FunctionComponent } from 'react';
import { BoxField } from '../../components/common/BoxField';
import { LineField } from '../../components/common/LineField';
import { THEMES } from '../../constants/common';
import { useFractionDigits } from '../../stores/fractionDigitsStore';
import { useThemeValue } from '../../stores/themeValueStore';

export const SettingsPage: FunctionComponent = () => {
  const [themeValue, setThemeValue] = useThemeValue();
  const [fractionDigits, setFractionDigits] = useFractionDigits();

  const resultDigit = `Will show: ${(1000.12345678).toFixed(
    fractionDigits
  )}`;

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
                name="theme"
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
          id="fraction-digit-source"
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

        <LineField
          id="fraction-digit-result"
          label="Example output"
          type="text"
          readOnly={true}
          value={resultDigit}
        />
      </form>
    </>
  );
};
