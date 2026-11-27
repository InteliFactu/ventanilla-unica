/** An incomplete calendar cannot establish the outstanding instalments. */
export const hasCompleteAgreementCalendarTable = (
  table: string,
  closingPart: string | undefined,
  rowCount: number,
): boolean =>
  rowCount > 0 &&
  /^<\/table\s*>/i.test(closingPart ?? '') &&
  [...table.matchAll(/<tr\b/gi)].length === rowCount + 1
