import { type FunctionComponent } from 'react';
import { NavLink, Outlet, type NavLinkRenderProps } from 'react-router';
import { useQueryParamsSync } from '../../features/currency/hooks/useQueryParamsSync';
import { useRoutesUrls } from '../../features/currency/hooks/useRoutesUrls';
import { useThemeValueSync } from '../../hooks/useThemeValueSync';
import { useTitle } from '../../hooks/useTitle';
import { classNames } from '../../lib/classNames';
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
          <NavLink className={handleClassName} to="/about">
            About
          </NavLink>
          <NavLink className={handleClassName} to="/settings">
            Settings
          </NavLink>
        </div>
      </header>
      <main className={styles.LayoutContent}>
        <Outlet />
      </main>
    </>
  );
};
