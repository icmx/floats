import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type { SymbolCardData } from '../components/SymbolCard';

export type SymbolCardsStore = {
  entries: SymbolCardData[];
  add: (value: string) => void;
  check: (checked: boolean, value: string) => void;
  remove: (value: string) => void;
};

const useSymbolCardsStore = create<SymbolCardsStore>()(
  persist(
    (set, get) => {
      return {
        entries: [
          { checked: false, value: 'USDRUB' },
          { checked: true, value: 'KGSAMD' },
        ],
        add: (value) => {
          const entries = [
            ...get().entries,
            { checked: false, value: value },
          ];

          set({ entries });
        },
        check: (checked, value) => {
          const entries = get().entries.map((entry) => {
            return entry.value === value ? { checked, value } : entry;
          });

          set({ entries });
        },
        remove: (value) => {
          const entries = get().entries.filter((entry) => {
            return entry.value !== value;
          });

          set({ entries });
        },
      };
    },
    {
      name: 'floats/symbolCards',
      storage: createJSONStorage(() => localStorage),
      version: 0,
    }
  )
);

export const useSymbolCards = () => {
  return useSymbolCardsStore((state) => {
    return state.entries;
  });
};

export const useSymbolCardsActions = () => {
  return useSymbolCardsStore(
    useShallow((state) => {
      return {
        add: state.add,
        check: state.check,
        remove: state.remove,
      };
    })
  );
};
