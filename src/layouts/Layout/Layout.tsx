import { type FunctionComponent } from 'react';
import { Outlet, useMatches, type UIMatch } from 'react-router';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useThemeValueEffect } from '../../hooks/useThemeValueEffect';
import styles from './Layout.module.css';

export const Layout: FunctionComponent = () => {
  useThemeValueEffect();

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

  return (
    <>
      <title>{title}</title>

      <header className={styles.LayoutHeader}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <p>
          <a href="/settings">Settings</a>
        </p>
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
