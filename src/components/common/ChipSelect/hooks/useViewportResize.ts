import { useEffect } from 'react';

export type UseViewportResizeOptions = {
  skip: boolean;
  onViewportResize: (event: Event) => void;
};

export const useViewportResize = ({
  skip,
  onViewportResize,
}: UseViewportResizeOptions): void => {
  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport || skip) {
      return;
    }

    const handleResize = (event: Event) => {
      onViewportResize(event);
    };

    viewport.addEventListener('resize', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, [skip, onViewportResize]);
};
