export const isYouthGuaranteeStepAnswers = (
  value: unknown,
): value is Readonly<Record<string, string>> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.values(value).every(
    (answer: unknown) => typeof answer === 'string',
  )
}
