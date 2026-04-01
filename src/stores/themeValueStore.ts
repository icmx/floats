import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThemeValue } from '../types/themes';

export const useThemeValueStore = create<{
  themeValue: ThemeValue;
  setThemeValue: (theme: ThemeValue) => void;
}>()(
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
