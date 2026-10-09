import type { RelecReceipt } from '../types/RelecReceipt'

/**
 * The "3. Descargar justificante" page TramitaJustif answers: the CSV and
 * filer NIF of the justificante (`DocumentCheck?ACTION=view&CUD=..&NIF=..`),
 * its download link, the sede clock (`var serverdate = new Date(<ms>)`) and,
 * when the page names it, the registry number. No CSV means no registration
 * this tool can prove.
 */
export const parseRelecResult = (html: string, url: string): RelecReceipt => {
  const view =
    /DocumentCheck\?ACTION=view&(?:amp;)?CUD=(\d+)&(?:amp;)?NIF=([\w-]+)/.exec(
      html,
    )
  const csv = view?.[1]
  const nif = view?.[2]
  if (csv === undefined || nif === undefined)
    throw new Error(
      'TramitaJustif answered no justificante CSV; check `caceres registros` before filing again',
    )
  const download =
    /href="(\.\.\/Utils\/DocumentCheck\?[^"]*method=download[^"]*)"/.exec(
      html,
    )?.[1]
  const millis = /var serverdate = new Date\((\d+)\)/.exec(html)?.[1]
  return {
    csv,
    nif,
    registryNumber: /\b([A-Z]{3}\d{10})\b/.exec(html)?.[1],
    answeredAt:
      millis === undefined ? undefined : new Date(Number(millis)).toISOString(),
    justificanteUrl: new URL(
      (
        download ?? `../Utils/DocumentCheck?ACTION=view&CUD=${csv}&NIF=${nif}`
      ).replaceAll('&amp;', '&'),
      url,
    ).toString(),
  }
}
