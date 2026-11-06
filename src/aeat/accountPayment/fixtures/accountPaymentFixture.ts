/** Invented identifiers with the exact shapes the LiquidacionesCuenta pages print. */
export const accountPaymentFixture = {
  nif: '00000000T',
  nombre: 'PEREZ GIL ANA',
  modelo: '010',
  justificante: '010000000001A',
  importe: '50,00',
  /** Entity 1583 with valid CCC digits and IBAN checksum, invented account. */
  iban: 'ES1915830001180000012345',
  nrc: '010000000001AXYZ123456',
} as const
