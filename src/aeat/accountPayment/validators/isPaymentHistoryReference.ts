import { isJustificanteText } from './isJustificanteText'

/** An autoliquidación can omit the justificante number; all other types print it. */
export const isPaymentHistoryReference = (
  type: string,
  reference: string,
): boolean =>
  isJustificanteText(reference.toUpperCase()) ||
  (reference === '-' && /^autoliquid(?:\.|aci[oó]n)$/i.test(type))
