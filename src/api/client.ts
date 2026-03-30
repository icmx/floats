export const API_BASE_URL = import.meta.env.BUNDLE_API_BASE_URL;

export const fetchString = async (url: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/${url}`);

  if (!response.ok) {
    throw new Error(
      `Unable to fetch "${url}": ${response.status}/${response.statusText}`
    );
  }

  const text = await response.text();

  return text;
};
