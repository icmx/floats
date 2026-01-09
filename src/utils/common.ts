export const asError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error(`Unknown error: "${error}"`, { cause: error });
};

export const classNames = (
  init: string | (false | string)[] | Record<string, boolean>
): string => {
  if (!init) {
    return '';
  }

  if (typeof init === 'string') {
    return init.trim();
  }

  if (Array.isArray(init)) {
    return classNames(
      init
        .filter((i): i is string => {
          return typeof i === 'string' && !!i;
        })
        .map((i) => {
          return i.trim();
        })
        .join(' ')
    );
  }

  if (typeof init === 'object') {
    const keys = Array.from(Object.entries(init))
      .filter(([, value]) => {
        return !!value;
      })
      .map(([key]) => {
        return key;
      });

    return classNames(keys);
  }

  throw new Error('Unable to process class names');
};
