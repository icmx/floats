import { useEffect, type DependencyList, type RefObject } from 'react';

export type UseScrollToBottomOptions = {
  containerRef: RefObject<HTMLElement | null>;
};

export const useScrollToBottom = (
  { containerRef }: UseScrollToBottomOptions,
  deps: DependencyList
) => {
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
    });

    // @todo: maybe move this feature to imperative handler and make
    // the single effect both for chart and table (to scroll to most
    // recent data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps]);
};
