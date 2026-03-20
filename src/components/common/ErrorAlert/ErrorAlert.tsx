import type { FunctionComponent } from 'react';
import { Alert } from '../../common/Alert';
import type { ErrorAlertProps } from './ErrorAlert.types';

const FALLBACK_MESSAGE = 'Unknown error happened.';

const extractMessage = (error: unknown): string => {
  if (!error) {
    return FALLBACK_MESSAGE;
  }

  if (error instanceof Error) {
    return error.message || FALLBACK_MESSAGE;
  }

  if (typeof error === 'string') {
    return error;
  }

  return FALLBACK_MESSAGE;
};

export const ErrorAlert: FunctionComponent<ErrorAlertProps> = ({
  error,
}) => {
  const message = extractMessage(error);

  return (
    <Alert status="failure">
      <p>{message}</p>
    </Alert>
  );
};
