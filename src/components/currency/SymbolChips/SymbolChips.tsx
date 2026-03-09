import { useCallback, useMemo, type FunctionComponent } from 'react';
import { SYMBOLS } from '../../../constants/currency';
import { useQueryParams } from '../../../hooks/useQueryParams';
import {
  ChipSelect,
  type ChipSelectOption,
} from '../../common/ChipSelect';

export const SymbolChips: FunctionComponent = () => {
  const symbolOptions: ChipSelectOption<string>[] = useMemo(() => {
    return SYMBOLS.map((symbol) => {
      return {
        id: `symbol-${symbol}`,
        value: symbol,
        pattern: symbol.toLowerCase(),
        children: symbol,
      };
    });
  }, []);

  // should be exactly like that since user CAN enter some "invalid" symbols
  // from query string and still be cool. so user should be able to remove this
  const { queryParams, setQueryParams } = useQueryParams();
  const { by } = queryParams;

  const selectedSymbolOptions = useMemo<
    ChipSelectOption<string>[]
  >(() => {
    return by.map((symbol) => {
      return {
        id: `symbol-${symbol}`,
        value: symbol,
        pattern: symbol.toLowerCase(),
        children: symbol,
      };
    });
  }, [by]);

  const handleChange = useCallback(
    (options: ChipSelectOption<string>[]): void => {
      setQueryParams({ by: options.map((option) => option.value) });
    },
    [setQueryParams]
  );

  return (
    <ChipSelect
      options={symbolOptions}
      selectedOptions={selectedSymbolOptions}
      autoComplete="off"
      autoCapitalize="characters"
      placeholder="Type symbols like USDEUR"
      spellCheck={false}
      onChange={handleChange}
    />
  );
};
