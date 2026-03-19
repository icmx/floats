import type { FunctionComponent } from 'react';
import { Alert } from '../Alert';
import type { EmptyAlertProps } from './EmptyAlert.types';

export const EmptyAlert: FunctionComponent<EmptyAlertProps> = ({
  children,
}) => {
  return <Alert status="default">{children}</Alert>;
};
