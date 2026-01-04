import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type { SymbolCardData } from '../components/SymbolCard';
import type { SymbolString } from '../types/currency';

export type SymbolCardsStore = {
  entries: SymbolCardData[];
  add: (symbol: SymbolString) => void;
  check: (checked: boolean, symbol: SymbolString) => void;
  remove: (symbol: SymbolString) => void;
};

const useSymbolCardsStore = create<SymbolCardsStore>()(
  persist(
    (set, get) => {
      return {
        entries: [
          { checked: false, symbol: 'USDRUB' },
          { checked: true, symbol: 'KGSAMD' },
        ],
        add: (symbol) => {
          const entries = [
            ...get().entries,
            { checked: false, symbol },
          ];

          set({ entries });
        },
        check: (checked, symbol) => {
          const entries = get().entries.map((entry) => {
            return entry.symbol === symbol
              ? { checked, symbol }
              : entry;
          });

          set({ entries });
        },
        remove: (value) => {
          const entries = get().entries.filter((entry) => {
            return entry.symbol !== value;
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
