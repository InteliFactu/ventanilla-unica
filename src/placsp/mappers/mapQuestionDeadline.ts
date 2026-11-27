import type { QuestionDeadline } from '../types/QuestionDeadline'

/**
 * Calendar-date reference for the ordinary Article 138.3 LCSP 12-day period.
 * The actual question cutoff comes from the tender documents and the portal.
 */
export const mapQuestionDeadline = (
  finPresentacion: string | undefined,
): QuestionDeadline | undefined => {
  const dayMs = 86_400_000
  const leadDays = 12
  const match = /^(\d{2})\/(\d{2})\/(\d{4})(?=\s|$)/.exec(
    finPresentacion?.trim() ?? '',
  )
  if (!match) return undefined
  const [, day = '', month = '', year = ''] = match
  const submissionEnd = `${year}-${month}-${day}`
  const end = new Date(`${submissionEnd}T00:00:00Z`)
  if (
    year === '0000' ||
    Number.isNaN(end.getTime()) ||
    end.toISOString().slice(0, 10) !== submissionEnd
  ) {
    return undefined
  }
  const askBy = new Date(end.getTime() - leadDays * dayMs)
    .toISOString()
    .slice(0, 10)
  return { submissionEnd, askBy }
}
