import type { FunctionComponent } from 'react';
import { Callout } from '../../common/Callout';
import type { ErrorCalloutProps } from './ErrorCalloutProps';

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

export const ErrorCallout: FunctionComponent<ErrorCalloutProps> = ({
  error,
}) => {
  const message = extractMessage(error);

  return (
    <Callout appearance="failure">
      <p>
        <code>{message}</code>
      </p>
    </Callout>
  );
};
