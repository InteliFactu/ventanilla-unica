/** Validate the TGSS date control's format and bounds on the Madrid calendar. */
export const validateCertificateReferenceDate = (value: string): string => {
  const [, day = '', month = '', year = ''] =
    /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value) ?? []
  const iso = `${year}-${month}-${day}`
  const date = new Date(`${iso}T00:00:00.000Z`)
  const today = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Madrid',
  })
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== iso ||
    iso < '1980-01-01' ||
    iso >= today
  )
    throw new Error(
      'TGSS: --fecha must be a date in DD/MM/YYYY from 01/01/1980 through yesterday',
    )
  return value
}
