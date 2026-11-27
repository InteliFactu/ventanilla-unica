import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/** Pin SRAF targets to the AEAT's HTTPS origin and the exact read endpoint. */
export const readAgreementPortalUrl = (
  target: string,
  path: string,
): URL | undefined => {
  const address = target.replaceAll(/\s+/g, '')
  if (!URL.canParse(address, aeatBaseUrl)) return undefined
  const url = new URL(address, aeatBaseUrl)
  if (url.origin !== aeatBaseUrl || url.pathname !== path) return undefined
  return url.username || url.password || url.hash ? undefined : url
}
