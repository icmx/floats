import type { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router';
import { Alert } from '../../components/common/Alert';

export const NotFoundPage: FunctionComponent = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Alert status="default">
        <h2>Not Found</h2>
        <p>No such page: {pathname}</p>
        <p>
          <Link to="/explore">Go explore</Link>
        </p>
      </Alert>
    </>
  );
};
