/**
 * A plain `local@domain.tld` shape, the most the ROLECE form itself checks
 * before posting: one `@`, no whitespace, a dot inside the domain.
 */
export const isEmailAddress = (value: string): boolean => {
  const [local = '', domain = '', ...rest] = value.split('@')
  const dot = domain.indexOf('.')
  return (
    rest.length === 0 &&
    local !== '' &&
    !/\s/.test(value) &&
    dot > 0 &&
    dot < domain.length - 1
  )
}
