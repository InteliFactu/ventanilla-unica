import type { QuestionDeadline } from '../types/QuestionDeadline'

/**
 * The last day a question obliges the contracting body to answer: art. 138.3
 * LCSP makes the answer due 6 days before the submission deadline only for
 * questions asked at least 12 days before it. Undefined when the page shows
 * no deadline. Dates are calendar days in ISO form (`2026-10-07`).
 */
export const mapQuestionDeadline = (
  finPresentacion: string | undefined,
): QuestionDeadline | undefined => {
  const dayMs = 86_400_000
  const leadDays = 12
  const match = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(finPresentacion ?? '')
  if (!match) return undefined
  const [, day = '', month = '', year = ''] = match
  const end = Date.UTC(Number(year), Number(month) - 1, Number(day))
  const iso = (time: number): string =>
    new Date(time).toISOString().slice(0, 10)
  return { submissionEnd: iso(end), askBy: iso(end - leadDays * dayMs) }
}
