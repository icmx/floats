import { useEffect, useState, type FunctionComponent } from 'react';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';

export const SettingsPage: FunctionComponent = () => {
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
        <output style={{ fontFamily: 'monospace' }}>
          {resultDigit}
        </output>
        <div>
          <label htmlFor="fraction-gigit">Fraction Digits</label>
          <input
            id="fraction-gigits"
            type="number"
            min={0}
            max={8}
            step={1}
            value={fractionDigits}
            onChange={(event) => {
              const text = event.target.value;
              const int = Number.parseInt(text, 10);

              setFractionDigits(int);
            }}
          />
        </div>
      </form>
    </>
  );
};
