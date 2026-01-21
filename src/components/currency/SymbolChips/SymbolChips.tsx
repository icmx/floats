import { useCallback, useMemo, type FunctionComponent } from 'react';
import { SYMBOLS } from '../../../constants/currency';
import { useQueryParams } from '../../../hooks/useQueryParams';
import {
  ChipSelect,
  type ChipSelectOption,
} from '../../common/ChipSelect';

export const SymbolChips: FunctionComponent = () => {
  const symbolOptions: ChipSelectOption[] = useMemo(() => {
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

  const setSelectedSymbolOptions = useCallback<
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
        onChange={(options) => {
          setSelectedSymbolOptions(options);
        }}
      />
    </>
  );
};
