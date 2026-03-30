import type { FunctionComponent } from 'react';
import type { ErrorsFragmentProps } from './ErrorsFragment.types';
import { resolveErrorItems } from './ErrorsFragment.utils';

export const ErrorsFragment: FunctionComponent<ErrorsFragmentProps> = ({
  errors,
}) => {
  const items = resolveErrorItems(errors);

  return (
    <>
      {items.map(({ key, message }) => {
        return <p key={key}>{message}</p>;
      })}
    </>
  );
};
