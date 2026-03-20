export type Result<TData, TError> =
  | { success: true; data: TData }
  | { success: false; error: TError };

export type Results<TData, TError> = Result<TData, TError>[];

export type QueryParams = {
  by: string[];
};

export type StatusValue = 'default' | 'failure';

export type ThemeValue = 'system' | 'light' | 'dark';
