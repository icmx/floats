import type { PropsWithChildren } from 'react';
import type { StatusValue } from '../../../types/common';

export type AlertProps = PropsWithChildren & {
  status: StatusValue;
};
