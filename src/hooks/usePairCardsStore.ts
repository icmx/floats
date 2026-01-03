import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PairCardData } from '../components/PairCard';
import { useShallow } from 'zustand/shallow';

export type PairCardsStore = {
  entries: PairCardData[];
  add: (value: string) => void;
  check: (checked: boolean, value: string) => void;
  remove: (value: string) => void;
};

const usePairCardsStore = create<PairCardsStore>()(
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
      name: 'floats/pairCards',
      storage: createJSONStorage(() => localStorage),
      version: 0,
    }
  )
);

export const usePairCards = () => {
  return usePairCardsStore((state) => {
    return state.entries;
  });
};

export const usePairCardsActions = () => {
  return usePairCardsStore(
    useShallow((state) => {
      return {
        add: state.add,
        check: state.check,
        remove: state.remove,
      };
    })
  );
};
