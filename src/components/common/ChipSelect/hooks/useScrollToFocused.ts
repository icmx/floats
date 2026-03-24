import { useEffect, type RefObject } from 'react';

export type UseScrollToFocusedOptions = {
  listRef: RefObject<HTMLElement | null>;
  focusedIndex: number;
};

export const useScrollToFocused = ({
  listRef,
  focusedIndex,
}: UseScrollToFocusedOptions): void => {
  useEffect(() => {
    const list = listRef.current;

    if (!list || focusedIndex < 0) {
      return;
    }

    const child = list.children[focusedIndex] as HTMLElement;

    if (!child) {
      return;
    }

    child.scrollIntoView({ block: 'nearest' });
  }, [listRef, focusedIndex]);
};
