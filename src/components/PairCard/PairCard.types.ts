export type PairCardData = {
  checked: boolean;
  value: string;
};

export type PairCardProps = {
  data: PairCardData;
  onCheck?: (checked: boolean) => void;
  onRemove?: () => void;
};
