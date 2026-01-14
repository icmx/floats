import {
  useLocation,
  useNavigate,
  type NavigateOptions,
} from 'react-router';

export type SetURLSearchParams = (
  update: (searchParams: URLSearchParams) => URLSearchParams,
  options?: NavigateOptions
) => void;

// here i have to use it raw since standard URLSearchParams escape commas (i need this!)
export const useRawSearchParams = (): [
  URLSearchParams,
  SetURLSearchParams
] => {
  const navigate = useNavigate();
  const location = useLocation();

  const prevRawSearchParams = new URLSearchParams(location.search);

  const setRawSearchParams: SetURLSearchParams = (update, options) => {
    const nextRawSearchParams = update(prevRawSearchParams);
    const nextRawSearchParamsString = Array.from(
      nextRawSearchParams.entries()
    )
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join('&');

    const nextUrl = `${location.pathname}?${nextRawSearchParamsString}`;

    navigate(nextUrl, options);
  };

  return [prevRawSearchParams, setRawSearchParams];
};
