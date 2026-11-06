/**
 * The NRC on the final page: the justificante followed by nine letters or
 * digits, printed after "El NRC generado es:" and kept in a hidden `nrc`
 * input. Any other 22-character token is ignored.
 */
export const parsePaymentNrc = (
  html: string,
  justificante: string,
): string | undefined =>
  [...html.matchAll(/\b([0-9A-Z]{22})\b/g)]
    .map(([, token = '']) => token)
    .find((token) => token.startsWith(justificante))
