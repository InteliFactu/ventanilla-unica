/** One `@` with a non-empty local part and a dotted domain, no spaces: enough to catch a typo before Red.es does. */
export const isEmailShaped = (email: string): boolean => {
  const [local, domain, extra] = email.split('@')
  return (
    extra === undefined &&
    Boolean(local) &&
    !/\s/.test(email) &&
    (domain ?? '').split('.').filter(Boolean).length >= 2
  )
}
