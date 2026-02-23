import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThemeValue } from '../types/common';

export type ThemeState = {
  themeValue: ThemeValue;
  setThemeValue: (theme: ThemeValue) => void;
};

export const useThemeValueStore = create<ThemeState>()(
  persist(
    (set) => {
      return {
        themeValue: 'system',
        setThemeValue: (themeValue) => {
          set({ themeValue });
        },
      };
    },
    {
      name: 'floats/themeValue',
      storage: createJSONStorage(() => localStorage),
      version: 0,
    }
  )
);

export const useThemeValue = (): [
  ThemeValue,
  (themeValue: ThemeValue) => void
] => {
  const themeValue = useThemeValueStore((state) => state.themeValue);

  const setThemeValue = useThemeValueStore(
    (state) => state.setThemeValue
  );

  return [themeValue, setThemeValue];
};
