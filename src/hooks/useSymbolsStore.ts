import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type { SymbolString } from '../types/currency';

export type SymbolEntry = {
  id: SymbolString;
  checked: boolean;
};

export type SymbolsStore = {
  entries: SymbolEntry[];
  add: (id: SymbolString) => void;
  check: (id: SymbolString, checked: boolean) => void;
  remove: (id: SymbolString) => void;
};

export const useSymbolsStore = create<SymbolsStore>()(
  persist(
    (set, get) => {
      return {
        entries: [
          { id: 'USDCHF', checked: true },
          { id: 'EURJPY', checked: false },
        ],

        add: (id) => {
          const entries: SymbolEntry[] = [
            ...get().entries,
            { id, checked: false },
          ];

          set({ entries });
        },

        check: (id, checked) => {
          const entries: SymbolEntry[] = get().entries.map((entry) => {
            return entry.id === id ? { ...entry, id, checked } : entry;
          });

          set({ entries });
        },

        remove: (id) => {
          const entries: SymbolEntry[] = get().entries.filter(
            (entry) => {
              return entry.id !== id;
            }
          );

          set({ entries });
        },
      };
    },
    {
      name: 'floats/symbols',
      storage: createJSONStorage(() => localStorage),
      version: 0,
    }
  )
);

export const useSymbolsStoreEntries = () => {
  return useSymbolsStore((state) => {
    return state.entries;
  });
};

export const useSymbolsStoreActions = () => {
  return useSymbolsStore(
    useShallow((state) => {
      return {
        add: state.add,
        check: state.check,
        remove: state.remove,
      };
    })
  );
};
