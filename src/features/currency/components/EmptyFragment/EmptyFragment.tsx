import { type FunctionComponent } from 'react';
import { Link } from 'react-router';

export const EmptyFragment: FunctionComponent = () => {
  return (
    <>
      <p>No symbols are selected to show.</p>
      <p>
        Try <Link to={'?by=USDEUR'}>USDEUR</Link> for instance.
      </p>
    </>
  );
};
