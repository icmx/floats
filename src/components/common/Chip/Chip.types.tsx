import type { MouseEventHandler, PropsWithChildren } from 'react';

export type ChipProps = PropsWithChildren & {
  type?: 'a' | 'button' | 'div';
  disabled?: boolean;
  selected?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};
