export type Breadcrumb = {
  id: string;
  href: string;
  children: string;
};

export type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};
