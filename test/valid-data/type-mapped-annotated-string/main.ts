import { Size } from "./size";

/**
 * Currency
 * @pattern ^[A-Z]{3,3}$
 */
type CurrencyISO = string;

/**
 * Exchange rate
 */
export type ExchangeRate = Record<CurrencyISO, number>;

/**
 * Size chart
 */
export type SizeChart = Record<Size, number>;
