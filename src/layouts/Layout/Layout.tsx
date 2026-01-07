import type { FunctionComponent } from 'react';
import { Outlet } from 'react-router';

export const Layout: FunctionComponent = () => {
  return (
    <>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>floats</h1>
        <p>
          <a href="/settings">Settings</a>
        </p>
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
