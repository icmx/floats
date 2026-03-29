declare const __brand__: unique symbol;

export type Brand<T extends string> = { [__brand__]: T };

export type Branded<TType, TBrand extends string> = TType &
  Brand<TBrand>;

export type Result<TData, TError> =
  | { success: true; data: TData }
  | { success: false; error: TError };

export type Results<TData, TError> = Result<TData, TError>[];

export type QueryParams = {
  by: string[];
};

export type StatusValue = 'default' | 'failure';

export type ThemeValue = 'system' | 'light' | 'dark';

export type RouteHandle = {
  title?: ((queryParams: QueryParams) => string) | string;
};
