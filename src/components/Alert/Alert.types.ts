import type { PropsWithChildren } from 'react';
import type { StatusValue } from '../../types';

export type AlertProps = PropsWithChildren & {
  status: StatusValue;
};
