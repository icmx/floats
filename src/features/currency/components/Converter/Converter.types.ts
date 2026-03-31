import type { CodeString } from '../../types';

export type ConverterProps = {
  baseAmount: number;
  baseCode: CodeString;
  quoteCode: CodeString;
  rate: number;
};
