import { useEffect } from 'react';

export type UseViewportResizeOptions = {
  disabled: boolean;
  onViewportResize: (event: Event) => void;
};

export type UseViewportResizeResult = void;

export const useViewportResize = ({
  disabled,
  onViewportResize,
}: UseViewportResizeOptions): UseViewportResizeResult => {
  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport || disabled) {
      return;
    }

    const handleResize = (event: Event) => {
      onViewportResize(event);
    };

    viewport.addEventListener('resize', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, [disabled, onViewportResize]);
};
