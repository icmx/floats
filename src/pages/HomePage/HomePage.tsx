import { useMemo, type FunctionComponent } from 'react';
import { PAIRS } from '../../constants/pairs';
import {
  Autocomplete,
  type AutocompleteOption,
} from '../../components/Autocomplete';

export const HomePage: FunctionComponent = () => {
  const currencyPairs: AutocompleteOption[] = useMemo(() => {
    return PAIRS.map((pair) => {
      return {
        id: `option-${pair}`,
        text: pair,
        value: pair,
      };
    });
  }, []);

  return (
    <>
      <title>floats</title>
      <Autocomplete options={currencyPairs} />
    </>
  );
};
