/** `--asunto`: required, at most the form's 240 characters. */
export const validateSubjectOption = (value: string | undefined): string => {
  const subject = value?.trim() ?? ''
  if (!subject || subject.length > 240)
    throw new Error('--asunto is required (at most 240 characters)')
  return subject
}
