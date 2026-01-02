import {
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from 'react';
import { PAIRS } from '../../constants/pairs';
import {
  Autocomplete,
  type AutocompleteHandle,
  type AutocompleteOption,
} from '../../components/Autocomplete';

export const HomePage: FunctionComponent = () => {
  const currencyPairs: AutocompleteOption[] = useMemo(() => {
    return PAIRS.map((pair) => {
      return {
        id: `option-${pair}`.toLowerCase(),
        text: pair,
        value: pair,
      };
    });
  }, []);

  const [option, setOption] = useState<AutocompleteOption | null>(null);
  const ref = useRef<AutocompleteHandle>(null);

  return (
    <>
      <title>floats</title>
      <Autocomplete
        ref={ref}
        options={currencyPairs}
        onOptionChange={(o) => {
          setOption(o);

          ref.current?.reset();
        }}
      />
      <pre>selected: {JSON.stringify(option)}</pre>
    </>
  );
};
