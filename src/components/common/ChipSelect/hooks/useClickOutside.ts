import { useEffect, type RefObject } from 'react';

export type UseClickOutsideOptions = {
  containerRef: RefObject<HTMLElement | null>;
  skip: boolean;
  onClickOutside: (event: MouseEvent) => void;
};

export const useClickOutside = ({
  containerRef,
  skip,
  onClickOutside,
}: UseClickOutsideOptions): void => {
  useEffect(() => {
    const container = containerRef.current;

    if (!container || skip) {
      return;
    }

    const handleMousedown = (event: MouseEvent) => {
      if (!container.contains(event.target as Node)) {
        onClickOutside(event);
      }
    };

    document.addEventListener('mousedown', handleMousedown);

    return () => {
      document.removeEventListener('mousedown', handleMousedown);
    };
  }, [containerRef, skip, onClickOutside]);
};
