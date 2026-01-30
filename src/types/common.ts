export type Result<TData, TError = unknown> =
  | { success: true; data: TData }
  | { success: false; error: TError };

export type Results<TData, TError = unknown> = Result<TData, TError>[];

export type QueryParams = {
  by: string[];
};

export type ThemeValue = 'system' | 'light' | 'dark';
