import type { FunctionComponent } from 'react';
import { Outlet } from 'react-router';
import styles from './Layout.module.css';

export const Layout: FunctionComponent = () => {
  return (
    <>
      <header className={styles.LayoutHeader}>
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
      <footer className={styles.LayoutFooter}>
        <p>floats - currencies explorer</p>
      </footer>
    </>
  );
};
