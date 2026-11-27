/** Accept only the parameters observed on the SRAF calendar read for this agreement. */
export const isAgreementCalendarQuery = (
  params: URLSearchParams,
  agreement: string,
): boolean =>
  params.size === 5 &&
  params.get('fAccion') === 'consIntPlazos' &&
  params.get('acuerdo') === agreement &&
  /^\d+$/.test(params.get('solicitud') ?? '') &&
  /^\w+$/.test(params.get('kliq') ?? '') &&
  /^\d+$/.test(params.get('numordvto') ?? '')
