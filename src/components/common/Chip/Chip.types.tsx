import type { PropsWithChildren } from 'react';

export type ChipProps = PropsWithChildren & {
  disabled?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};
