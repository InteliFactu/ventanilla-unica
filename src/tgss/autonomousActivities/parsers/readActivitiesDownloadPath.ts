/**
 * The relative resource URL the "Descargar informe" button fetches
 * (`descargaDoc(this,"p0/...")`), or undefined when the page offers none.
 */
export const readActivitiesDownloadPath = (html: string): string | undefined =>
  /descargaDoc\(this,\s*"([^"]+)"/.exec(html)?.[1]
