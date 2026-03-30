import type { ErrorItem } from './ErrorsFragment.types';

export const FALLBACK_MESSAGE = 'Unknown error happened.';

export const resolveErrorItems = (errors: unknown[]): ErrorItem[] => {
  return errors
    .map((error) => {
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
    })
    .map((message, index) => {
      const key = `${index}-${message}`;

      return {
        key,
        message,
      };
    });
};
