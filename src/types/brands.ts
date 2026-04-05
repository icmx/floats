declare const __brand__: unique symbol;

export type Brand<T extends string> = { [__brand__]: T };

export type Branded<TType, TBrand extends string> = TType &
  Brand<TBrand>;
