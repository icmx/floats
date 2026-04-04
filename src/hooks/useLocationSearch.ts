import { useCallback } from 'react';
import {
  type NavigateOptions,
  useLocation,
  useNavigate,
} from 'react-router';

export type UseLocationSearch = [
  string,
  (value: string, options?: NavigateOptions) => void
];

export const useLocationSearch = (): UseLocationSearch => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationSearch = location.search;

  const setLocationSearch = useCallback<UseLocationSearch[1]>(
    (value, options): void => {
      const to = `${location.pathname}${value}`;

      navigate(to, options);
    },
    [location.pathname, navigate]
  );

  return [locationSearch, setLocationSearch];
};
