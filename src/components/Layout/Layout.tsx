import { type FunctionComponent } from 'react';
import { NavLink, Outlet, type NavLinkRenderProps } from 'react-router';
import { PATHS } from '@/config/paths';
import { useQueryParamsSync } from '@/features/currency/hooks/useQueryParamsSync';
import { useRoutePaths } from '@/features/currency/hooks/useRoutePaths';
import { useThemeValueSync } from '@/hooks/useThemeValueSync';
import { useTitle } from '@/hooks/useTitle';
import { classNames } from '@/lib/classNames';
import styles from './Layout.module.css';

export const Layout: FunctionComponent = () => {
  useThemeValueSync();
  useQueryParamsSync();

  const title = useTitle();
  const routePaths = useRoutePaths();

  const handleClassName = ({
    isActive,
  }: NavLinkRenderProps): string | undefined => {
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
          <NavLink className={handleClassName} to={routePaths.explore}>
            Explore
          </NavLink>
          <NavLink className={handleClassName} to={routePaths.convert}>
            Convert
          </NavLink>
        </div>
        <div className={styles.HeaderGroup}>
          <NavLink
            className={handleClassName}
            to={PATHS.pages.about.path}
          >
            About
          </NavLink>
          <NavLink
            className={handleClassName}
            to={PATHS.pages.settings.path}
          >
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
