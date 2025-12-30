import type { FunctionComponent } from 'react';
import { Outlet } from 'react-router';

export const Layout: FunctionComponent = () => {
  return (
    <>
      <header>
        <h1>floats</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>floats</p>
      </footer>
    </>
  );
};
