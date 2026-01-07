import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FractionDigitsStore = {
  fractionDigits: number;
  setFractionDigits: (fractionDigits: number) => void;
};

export const useFractionDigitsStore = create<FractionDigitsStore>()(
  persist(
    (set) => {
      return {
        fractionDigits: 2,

        setFractionDigits: (fractionDigits) => {
          set({ fractionDigits });
        },
      };
    },
    {
      name: 'floats/fractionDigits',
      storage: createJSONStorage(() => localStorage),
      version: 0,
    }
  )
);

export const useFractionDigits = (): [
  number,
  (fractionDigits: number) => void
] => {
  const fractionDigits = useFractionDigitsStore(
    (state) => state.fractionDigits
  );

  const setFractionDigits = useFractionDigitsStore(
    (state) => state.setFractionDigits
  );

  return [fractionDigits, setFractionDigits];
};
