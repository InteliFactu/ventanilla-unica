/** Bind the advertised resolution to the expected agreement's padded hex code. */
export const isAgreementResolutionQuery = (
  params: URLSearchParams,
  agreement: string,
): boolean => {
  const encodedAgreement = Buffer.from(agreement.padEnd(15), 'ascii').toString(
    'hex',
  )
  return (
    params.size === 3 &&
    params.get('fAccion') === 'verpdfres' &&
    /^\w+$/.test(params.get('fcerti') ?? '') &&
    params.get('cdacu')?.toLowerCase() === encodedAgreement
  )
}
