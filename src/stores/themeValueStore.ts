import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
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

export const useThemeValue = () => {
  return useThemeValueStore(
    useShallow((state) => {
      return {
        themeValue: state.themeValue,
        setThemeValue: state.setThemeValue,
      };
    })
  );
};
