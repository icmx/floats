import { useCallback, useMemo, type FunctionComponent } from 'react';
import { SYMBOLS } from '../../../constants/currency';
import {
  ChipSelect,
  type ChipSelectOption,
} from '../../common/ChipSelect';
import { useSymbolsFromQueryParam } from '../../../hooks/useSymbolsFromQueryParam';
import type { SymbolString } from '../../../types/currency';

export const SymbolChips: FunctionComponent = () => {
  const symbolOptions: ChipSelectOption<SymbolString>[] =
    useMemo(() => {
      return SYMBOLS.map((symbol) => {
        return {
          id: `symbol-${symbol}`,
          value: symbol,
          pattern: symbol.toLowerCase(),
          children: symbol,
        };
      });
    }, []);

  const { symbols, setSymbols } = useSymbolsFromQueryParam();

  const selectedSymbolOptions = useMemo<
    ChipSelectOption<SymbolString>[]
  >(() => {
    return symbols.map((symbol) => {
      return {
        id: `symbol-${symbol}`,
        value: symbol,
        pattern: symbol.toLowerCase(),
        children: symbol,
      };
    });
  }, [symbols]);

  const handleChange = useCallback<
    (options: ChipSelectOption<SymbolString>[]) => void
  >(
    (options) => {
      setSymbols(options.map((option) => option.value));
    },
    [setSymbols]
  );

  return (
    <>
      <ChipSelect
        options={symbolOptions}
        selectedOptions={selectedSymbolOptions}
        placeholder="Type symbols like USDEUR"
        onChange={handleChange}
      />
    </>
  );
};
