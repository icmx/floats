import type { PropsWithChildren } from 'react';
import type { StatusValue } from '@/types/statuses';

export type AlertProps = PropsWithChildren & {
  status: StatusValue;
};
