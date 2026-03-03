import { type FunctionComponent } from 'react';
import { NavLink, Outlet, type NavLinkRenderProps } from 'react-router';
import { useQueryParamsSync } from '../../hooks/useQueryParamsSync';
import { useRoutesUrls } from '../../hooks/useRoutesUrls';
import { useThemeValueSync } from '../../hooks/useThemeValueSync';
import { useTitle } from '../../hooks/useTitle';
import { classNames } from '../../utils/common';
import styles from './Layout.module.css';

export const Layout: FunctionComponent = () => {
  useThemeValueSync();
  useQueryParamsSync();

  const title = useTitle();
  const urls = useRoutesUrls();

  const handleClassName = ({
    isActive,
  }: NavLinkRenderProps): string => {
    return classNames({
      [styles.HeaderLink]: true,
      [styles.isActive]: isActive,
    });
  };

  return (
    <>
      <title>{title}</title>

      <header className={styles.LayoutHeader}>
        <div className={styles.HeaderGroup}>
          <NavLink className={handleClassName} to={urls.explore}>
            Explore
          </NavLink>
          <NavLink className={handleClassName} to={urls.convert}>
            Convert
          </NavLink>
        </div>
        <div className={styles.HeaderGroup}>
          <NavLink className={handleClassName} to="/settings">
            Settings
          </NavLink>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className={styles.LayoutFooter}>
        <p>floats - currency explorer app (WIP)</p>
      </footer>
    </>
  );
};
