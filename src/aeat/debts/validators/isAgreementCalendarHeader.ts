/** The seven column labels observed in the SRAF consultation. */
export const isAgreementCalendarHeader = (cells: readonly string[]): boolean =>
  cells
    .join('|')
    .normalize('NFD')
    .replaceAll(/[\p{M}\s.]/gu, '')
    .toLowerCase() ===
  'deudas|numplazo|fase|fechalimiteingreso|importependiente|interesesprecal|importetotal'
