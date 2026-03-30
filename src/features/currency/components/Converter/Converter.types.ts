import type { CodeString } from '../../../../types/currency';

export type ConverterProps = {
  baseAmount: number;
  baseCode: CodeString;
  quoteCode: CodeString;
  rate: number;
};
