/** Conditions shared between fields of the 2025 declarant record. */
export const validateModel190Declarant = (
  record: string,
): readonly string[] => {
  const problems: string[] = []
  if (!record.slice(17, 57).trim())
    problems.push('nombre (18-57): declarant name must not be blank')
  const email = record.slice(175, 225).trimEnd()
  if (
    email &&
    !/^[^\s@<>]+@(?:[\dA-Z]+(?:-[\dA-Z]+)*\.)+[A-Z]{2,}$/i.test(email)
  )
    problems.push('correo (176-225): expected an email address')
  const status = record.slice(120, 122)
  const previous = record.slice(122, 135)
  if (status === 'CS')
    problems.push(
      'complementaria/sustitutiva (121-122): the flags are mutually exclusive',
    )
  if (status === '  ' && previous !== '0000000000000')
    problems.push(
      'anterior (123-135): expected zero for an original declaration',
    )
  if ((status === 'C ' || status === ' S') && previous === '0000000000000')
    problems.push(
      'anterior (123-135): a previous declaration identifier is required',
    )
  return problems
}
