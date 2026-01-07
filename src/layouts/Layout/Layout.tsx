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
        <a href="/">
          <h1>floats</h1>
        </a>
        <p>
          <a href="/settings">Settings</a>
        </p>
      </header>
      <main>
        <Outlet />
      </main>
      <footer
        style={{ margin: '1rem 0 0', borderTop: 'solid 1px #eeeeee' }}
      >
        <p>floats - currencies explorer</p>
      </footer>
    </>
  );
};
