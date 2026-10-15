/** Keep session tokens and passwords on the Rayuela origin. */
export const validateRayuelaUrl = (
  value: string,
  base = 'https://rayuela.educarex.es/segedu/jsp/',
): string => {
  const url = new URL(value, base)
  if (
    url.origin !== 'https://rayuela.educarex.es' ||
    url.username ||
    url.password
  )
    throw new Error('Rayuela returned an unexpected URL')
  return url.href
}
