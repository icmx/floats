import { useEffect, useState, type FunctionComponent } from 'react';
import type { TimeoutProps } from './Timeout.types';

export const Timeout: FunctionComponent<TimeoutProps> = ({
  children,
  delay,
}) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setShouldShow(true);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [delay]);

  if (!shouldShow) {
    return null;
  }

  return children;
};
