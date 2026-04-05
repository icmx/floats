export type ClassNamesInit =
  | Record<string, boolean | null | undefined>
  | (string | false | null | undefined)[]
  | string
  | null
  | undefined;

export type ClassNamesResult = string | undefined;

/**
 * @todo Remove object init (used only unce)
 * @todo Test this entry
 */
export const classNames = (init: ClassNamesInit): ClassNamesResult => {
  if (!init) {
    return undefined;
  }

  if (typeof init === 'string') {
    return init.trim().replace(/\s+/g, ' ');
  }

  if (Array.isArray(init)) {
    return init
      .filter((entry): entry is string => {
        return typeof entry === 'string' && !!entry;
      })
      .map((entry) => {
        return entry.trim().replace(/\s+/g, ' ');
      })
      .join(' ');
  }

  if (typeof init === 'object') {
    return Array.from(Object.entries(init))
      .filter(([, value]) => {
        return !!value;
      })
      .map(([key]) => {
        return key.trim().replace(/\s+/g, ' ');
      })
      .join(' ');
  }

  throw new Error(`Invalid class init: ${init}`);
};
