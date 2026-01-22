import { useCallback, useMemo, type FunctionComponent } from 'react';
import { SYMBOLS } from '../../../constants/currency';
import { useQueryParams } from '../../../hooks/useQueryParams';
import {
  ChipSelect,
  type ChipSelectOption,
} from '../../common/ChipSelect';
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

  const { by: symbols, setBy: setSymbols } = useQueryParams();

  const selectedSymbolOptions = useMemo<ChipSelectOption[]>(() => {
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
    (options: ChipSelectOption[]) => void
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
