import { placspUrls } from '../session/placspUrls'

/**
 * The canonical PLACSP link of one tender from `--expediente`: a PLACSP
 * URL carrying `idEvl` (the "Enlace a la licitación" of the detail page, or
 * the feed's `deeplink:detalle_licitacion` link), or the bare `idEvl`. A
 * file number alone is refused: it is unique only within one contracting
 * body, so it cannot name a tender by itself.
 */
export const mapTenderUrl = (value: string): string => {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    if (!(placspUrls.hosts as readonly string[]).includes(host))
      throw new Error(`--expediente ${url.hostname} is not a PLACSP link`)
    const idEvl = url.searchParams.get('idEvl')
    if (!idEvl) throw new Error('--expediente link carries no idEvl')
    return placspUrls.tenderDeeplink + encodeURIComponent(idEvl)
  }
  if (/^\d[\d/.-]*$/.test(trimmed))
    throw new Error(
      `--expediente ${trimmed} is a file number, unique only within its contracting body; pass the tender's PLACSP link (deeplink:detalle_licitacion&idEvl=...)`,
    )
  if (!/^[\w%+/=-]{8,}$/.test(trimmed))
    throw new Error(
      `--expediente ${trimmed} is neither a PLACSP link nor an idEvl`,
    )
  return (
    placspUrls.tenderDeeplink + encodeURIComponent(decodeURIComponent(trimmed))
  )
}
