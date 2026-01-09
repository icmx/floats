export type AsyncPayload<TData> = {
  isLoading: boolean;
  error: unknown;
  data: TData;
};
