import type { PropsWithChildren } from 'react';

export type ChipProps = PropsWithChildren & {
  onRemove?: () => void;
};
