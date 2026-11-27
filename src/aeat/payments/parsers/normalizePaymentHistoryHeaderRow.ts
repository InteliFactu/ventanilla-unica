/** MisPagos omits the opening row tag before the header cells on live pages. */
export const normalizePaymentHistoryHeaderRow = (table: string): string =>
  table.replace(/(<thead\b[^>]*>\s*)(?=<th\b)/i, '$1<tr>')
