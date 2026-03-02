import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { QueryParams } from '../types/common';

export const usePersistQueryParamsStore = create<{
  persistQueryParams: QueryParams;
  setPersistQueryParams: (prevQueryParams: QueryParams) => void;
}>()(
  persist(
    (set) => {
      return {
        persistQueryParams: {
          by: [] as string[],
        },
        setPersistQueryParams: (persistQueryParams) => {
          set({ persistQueryParams });
        },
      };
    },
    {
      name: 'floats/queryParams',
      // session storage to store it only per-tab
      storage: createJSONStorage(() => sessionStorage),
      version: 0,
    }
  )
);

export const usePersistQueryParams = () => {
  return usePersistQueryParamsStore(
    useShallow((state) => {
      return {
        persistQueryParams: state.persistQueryParams,
        setPersistQueryParams: state.setPersistQueryParams,
      };
    })
  );
};
