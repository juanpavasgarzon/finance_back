export const CURRENCY_CODES = ['USD', 'COP'] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];
