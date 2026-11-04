import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import { isYouthGuaranteeStepAnswers } from '../validators/isYouthGuaranteeStepAnswers'

/** Parse declarations locally; hidden state and action names are never accepted. */
export const parseYouthGuaranteeAnswers = (
  json?: string,
): YouthGuaranteeAnswers => {
  if (json === undefined) return {}
  const parsed: unknown = JSON.parse(json)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    throw new Error(
      'Garantía Juvenil: --respuestas must be a JSON object keyed by steps 1 to 6',
    )
  for (const [step, values] of Object.entries(parsed)) {
    if (!/^[1-6]$/.test(step) || !isYouthGuaranteeStepAnswers(values))
      throw new Error(
        'Garantía Juvenil: each step in --respuestas must map control names to strings',
      )
  }
  return parsed as YouthGuaranteeAnswers
}
