import { useEffect, type RefObject } from 'react';

export type UseClickOutsideOptions = {
  containerRef: RefObject<HTMLElement | null>;
  disabled: boolean;
  onClickOutside: (event: MouseEvent) => void;
};

export type UseClickOutsideResult = void;

export const useClickOutside = ({
  containerRef,
  disabled,
  onClickOutside,
}: UseClickOutsideOptions): UseClickOutsideResult => {
  useEffect(() => {
    const container = containerRef.current;

    if (!container || disabled) {
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
  }, [containerRef, disabled, onClickOutside]);
};
