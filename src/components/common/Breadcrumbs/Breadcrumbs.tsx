import type { FunctionComponent } from 'react';
import type { BreadcrumbsProps } from './Breadcrumbs.types';
import styles from './Breadcrumbs.module.css';

export const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = ({
  breadcrumbs,
}) => {
  const [firstBreadcrumb, ...restBreadcrumbs] = breadcrumbs;
  const shouldShowRestBreadcrumbs = restBreadcrumbs.length > 0;

  return (
    <nav className={styles.Breadcrumbs}>
      <h1 className={styles.FirstBreadcrumb}>
        <a href={firstBreadcrumb.href}>{firstBreadcrumb.children}</a>
      </h1>
      {shouldShowRestBreadcrumbs && (
        <ol className={styles.RestBreadcrumbs}>
          {restBreadcrumbs.map((breadcrumb) => {
            return (
              <li key={breadcrumb.id} className={styles.RestBreadcrumb}>
                {breadcrumb.children}
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
};
