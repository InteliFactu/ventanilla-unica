import { assertAdministrationUrl } from '../../../http/assertAdministrationUrl'

/** Validate every hop before the certificate-bearing client sees the link. */
export const validateYouthGuaranteeEmailLink = (value: string): string => {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port)
      throw new Error('unsafe link')
    assertAdministrationUrl(url.href)
    return url.href
  } catch {
    throw new Error(
      'Garantía Juvenil: refused email verification link; an HTTPS administration URL without credentials is required',
    )
  }
}
