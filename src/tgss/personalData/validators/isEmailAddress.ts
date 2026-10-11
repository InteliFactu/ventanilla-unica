/** One `@`, something before it, a dotted domain after it, and no whitespace. */
export const isEmailAddress = (value: string): boolean => {
  const [local = '', domain = '', ...rest] = value.split('@')
  return (
    local !== '' &&
    domain.includes('.') &&
    rest.length === 0 &&
    !/\s/.test(value)
  )
}
