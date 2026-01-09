export type AsyncPayload<TData> = {
  isLoading: boolean;
  error: Error | null;
  data: TData;
};
