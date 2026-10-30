/** The query framework's own notice for a search that matched nothing. */
export const isEmptyPowerList = (html: string): boolean =>
  html.includes('No se han obtenido resultados para estos datos')
