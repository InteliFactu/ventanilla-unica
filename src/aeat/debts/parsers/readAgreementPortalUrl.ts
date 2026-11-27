import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/** Pin SRAF targets to the AEAT's HTTPS origin and the exact read endpoint. */
export const readAgreementPortalUrl = (
  target: string,
  path: string,
  base: string = aeatBaseUrl,
): URL | undefined => {
  const address = target.replaceAll(/\s+/g, '')
  if (!URL.canParse(address, base)) return undefined
  const url = new URL(address, base)
  if (url.origin !== aeatBaseUrl || url.pathname !== path) return undefined
  return url.username || url.password || url.hash ? undefined : url
}
