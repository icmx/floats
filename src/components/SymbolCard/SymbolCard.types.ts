import type { SymbolString } from '../../types/currency';

export type SymbolCardData = {
  checked: boolean;
  symbol: SymbolString;
};

export type SymbolCardProps = {
  data: SymbolCardData;
  onCheck?: (checked: boolean) => void;
  onRemove?: () => void;
};
