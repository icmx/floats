import { type FunctionComponent, useMemo, useCallback } from 'react';
import {
  type ChipSelectOption,
  type ChipSelectProps,
  ChipSelect,
} from '../../../../components/ChipSelect';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { SYMBOLS } from '../../constants';
import { symbolChipsOptionsFilter } from './SymbolChips.utils';

export const SymbolChips: FunctionComponent = () => {
  const symbolOptions: ChipSelectOption[] = useMemo(() => {
    return SYMBOLS.map((symbol) => {
      return {
        key: `symbol-${symbol}`,
        value: symbol,
        pattern: symbol.toLowerCase(),
        children: symbol,
      };
    });
  }, []);

  // should be exactly like that since user CAN enter some "invalid" symbols
  // from query string and still be cool. so user should be able to remove this
  const {
    queryParams: { by },
    setQueryParams,
  } = useQueryParams();

  const selectedSymbolOptions = useMemo<ChipSelectOption[]>(() => {
    return by.map((symbol) => {
      return {
        key: `symbol-${symbol}`,
        value: symbol,
        pattern: symbol.toLowerCase(),
        children: symbol,
      };
    });
  }, [by]);

  const handleChange = useCallback<
    Exclude<ChipSelectProps['onChange'], undefined>
  >(
    (values) => {
      setQueryParams({ by: values });
    },
    [setQueryParams]
  );

  return (
    <ChipSelect
      options={symbolOptions}
      selectedOptions={selectedSymbolOptions}
      optionsFilter={symbolChipsOptionsFilter}
      autoComplete="off"
      autoCapitalize="characters"
      placeholder="Type symbols like USDEUR"
      spellCheck={false}
      onChange={handleChange}
    />
  );
};
