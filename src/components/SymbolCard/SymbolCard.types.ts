export type SymbolCardData = {
  checked: boolean;
  value: string;
};

export type SymbolCardProps = {
  data: SymbolCardData;
  onCheck?: (checked: boolean) => void;
  onRemove?: () => void;
};
