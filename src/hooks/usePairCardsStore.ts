import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PairCardData } from '../components/PairCard';
import { useShallow } from 'zustand/shallow';

export type PairCardsStore = {
  pairCards: PairCardData[];
  addPairCard: (value: string) => void;
  checkPairCard: (checked: boolean, value: string) => void;
  removePairCard: (value: string) => void;
};

export const usePairCardsStore = create<PairCardsStore>()(
  persist(
    (set, get) => {
      return {
        pairCards: [
          { checked: false, value: 'USDRUB' },
          { checked: true, value: 'KGSAMD' },
        ],
        addPairCard: (value) => {
          const pairCards = [
            ...get().pairCards,
            { checked: false, value: value },
          ];

          set({ pairCards });
        },
        checkPairCard: (checked, value) => {
          const pairCards = get().pairCards.map((pairCard) => {
            return pairCard.value === value
              ? { checked, value }
              : pairCard;
          });

          set({ pairCards });
        },
        removePairCard: (value) => {
          const pairCards = get().pairCards.filter((pairCard) => {
            return pairCard.value !== value;
          });

          set({ pairCards });
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
    return state.pairCards;
  });
};

export const usePairCardsActions = () => {
  return usePairCardsStore(
    useShallow((state) => {
      return {
        addPairCard: state.addPairCard,
        checkPairCard: state.checkPairCard,
        removePairCard: state.removePairCard,
      };
    })
  );
};
