/** Admit only the observed detail query and unambiguous agreement identifier. */
export const readAgreementDetailCode = (
  params: URLSearchParams,
): string | undefined => {
  if (params.get('fAccion') !== 'deta') return undefined
  const agreement = params.get('cacuerdo') ?? ''
  if (!/^\d{12}[A-Z]$/.test(agreement)) return undefined
  if (
    params.size === 2 ||
    (params.size === 3 && params.get('fFigura') === 'obli')
  )
    return agreement
  return undefined
}
