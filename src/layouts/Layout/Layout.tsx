import { type FunctionComponent } from 'react';
import {
  NavLink,
  Outlet,
  useMatches,
  type NavLinkRenderProps,
  type UIMatch,
} from 'react-router';
import { useThemeValueEffect } from '../../hooks/useThemeValueEffect';
import { useRoutesUrls } from '../../hooks/useRoutesUrls';
import { classNames } from '../../utils/common';
import styles from './Layout.module.css';

export const Layout: FunctionComponent = () => {
  useThemeValueEffect();

  const urls = useRoutesUrls();

  const matches = useMatches() as UIMatch<
    unknown,
    { title?: string }
  >[];

  const breadcrumbs = matches
    .filter((match): match is UIMatch<unknown, { title: string }> => {
      return !!match.handle?.title;
    })
    .map((match) => {
      return {
        id: match.id,
        href: match.pathname,
        children: match.handle.title,
      };
    });

  const title = breadcrumbs.map((crumb) => crumb.children).join(' - ');

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
        <div className="" style={{ display: 'flex', gap: '1rem' }}>
          <NavLink className={handleClassName} to={urls.chart}>
            Chart
          </NavLink>
          <NavLink className={handleClassName} to={urls.convert}>
            Convert
          </NavLink>
          <NavLink className={handleClassName} to={urls.data}>
            Data
          </NavLink>
        </div>
        <div className="">
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
