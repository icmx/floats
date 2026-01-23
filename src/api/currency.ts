import type { CodeString } from '../types/currency';
import { validateCodeString } from '../utils/currency';

export const PIVOT_CURRENCY_CODE = validateCodeString(
  import.meta.env.BUNDLE_API_PIVOT_CURRENCY
);

export class Currency {
  baseCode: CodeString;

  quoteCode: CodeString;

  data: [number, number][];

  constructor(baseCode: CodeString, quoteCode: CodeString) {
    this.baseCode = baseCode;
    this.quoteCode = quoteCode;
    this.data = [];
  }

  get isPivoting(): boolean {
    return (
      this.baseCode === PIVOT_CURRENCY_CODE &&
      this.quoteCode === PIVOT_CURRENCY_CODE
    );
  }

  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  appendWith(csv: string): this {
    csv
      .trim()
      .split('\n')
      .forEach((line) => {
        const [dateText, rateText] = line.split(',');

        this.data.push([
          new Date(dateText).getTime(),
          Number.parseFloat(rateText),
        ]);
      });

    return this;
  }

  rateBy(that: Currency): Currency {
    if (this.baseCode !== that.baseCode) {
      throw new Error(
        `Base codes must be the same. Now: "${this.baseCode}*", "${that.baseCode}*"`
      );
    }

    if (this.isPivoting) {
      return that;
    }

    if (that.isPivoting) {
      return this;
    }

    const ratesByDates = new Map<
      number,
      { left?: number; right?: number }
    >();

    this.data.forEach(([date, rate]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || {}),
        left: rate,
      });
    });

    that.data.forEach(([date, rate]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || {}),
        right: rate,
      });
    });

    const currency = new Currency(this.quoteCode, that.quoteCode);

    Array.from(ratesByDates.entries())
      .sort(([prev], [next]) => {
        return prev - next;
      })
      .forEach(([date, { left, right }]) => {
        if (!left || !right) {
          return;
        }

        currency.data.push([date, right / left]);
      });

    console.log(JSON.stringify(this));

    return currency;
  }
}
