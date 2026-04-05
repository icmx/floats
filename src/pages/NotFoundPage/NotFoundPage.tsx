import { type FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router';
import { Alert } from '@/components/Alert';
import { PATHS } from '@/config/paths';

export const NotFoundPage: FunctionComponent = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Alert status="default">
        <h2>Not Found</h2>
        <p>No such page: {pathname}</p>
        <p>
          <Link to={PATHS.pages.explore.path}>Go explore</Link>
        </p>
      </Alert>
    </>
  );
};
