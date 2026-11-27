/** The MisPagos columns, including versions with an unlabeled download column. */
export const isPaymentHistoryHeader = (cells: readonly string[]): boolean =>
  /^tipo\|modelo\/ej(?:ercicio)?\.?\/per[ií]odo\|n[.º°o]+justificante\|importe\|entidad\|fecha\|(?:justificante)?$/i.test(
    cells.map((cell) => cell.replaceAll(/\s+/g, '')).join('|'),
  )
