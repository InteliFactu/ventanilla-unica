/** Convert the published Spanish deadline to an ISO calendar date. */
export const parseAgreementDueDate = (date: string): string | undefined => {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(date)
  if (!match) return undefined
  const [, day, month, year] = match
  const iso = `${year ?? ''}-${month ?? ''}-${day ?? ''}`
  const dateUtc = new Date(`${iso}T00:00:00.000Z`)
  if (!Number.isFinite(dateUtc.valueOf())) return undefined
  return dateUtc.toISOString().startsWith(iso) ? iso : undefined
}
