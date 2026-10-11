/** The same shape the Carpeta front requires before it calls `verificar-email`: one `@`, no spaces, a dotted domain. */
export const isEmailAddress = (email: string): boolean => {
  const parts = email.split('@')
  const [local, domain] = parts
  return (
    parts.length === 2 &&
    !/\s/.test(email) &&
    local !== '' &&
    domain !== undefined &&
    /^[^.]+(?:\.[^.]+)+$/.test(domain)
  )
}
