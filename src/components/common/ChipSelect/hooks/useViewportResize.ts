import { useEffect, useEffectEvent } from 'react';

export type UseViewportResizeOptions = {
  skip: boolean;
  onViewportResize: (event: Event) => void;
};

export const useViewportResize = ({
  skip,
  onViewportResize,
}: UseViewportResizeOptions): void => {
  const handleResizeEvent = useEffectEvent((event: Event) => {
    onViewportResize(event);
  });

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport || skip) {
      return;
    }

    const handleResize = (event: Event) => {
      handleResizeEvent(event);
    };

    viewport.addEventListener('resize', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, [skip]);
};
