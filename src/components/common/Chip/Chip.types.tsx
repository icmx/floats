import type { MouseEventHandler, PropsWithChildren } from 'react';

export type ChipProps = PropsWithChildren & {
  type?: 'a' | 'button' | 'div';
  href?: string;
  onClick?: () => MouseEventHandler<HTMLElement>;
};
