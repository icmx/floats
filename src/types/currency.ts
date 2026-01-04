import type { CODES } from '../constants/currency';

export type CodeString = (typeof CODES)[number];

export type SymbolString = `${CodeString}${CodeString}`;
