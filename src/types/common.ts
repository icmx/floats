export type AsyncPayload<TData> = {
  isLoading: boolean;
  error: unknown;
  data: TData;
};

export type QueryParams = {
  by: string[];
};

export type ThemeValue = 'system' | 'light' | 'dark';
