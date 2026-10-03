import type { PlacspTender } from '../types/PlacspTender'
import { readSpanText } from './readSpanText'

/**
 * Read the public "Detalle de la licitación" page: the JSF output spans
 * `text_Expediente`, `text_OC_con` (contracting body), `text_ObjetoContrato`,
 * `text_Estado`, `text_FechaPresentacionOfertaConHora` and
 * `text_EnlaceLicPLACE`. A page without the file number is not a tender.
 */
export const readTenderDetail = (html: string, url: string): PlacspTender => {
  const expediente = readSpanText(html, ':text_Expediente')
  if (!expediente) throw new Error(`PLACSP: no tender detail at ${url}`)
  return {
    expediente,
    organoContratacion: readSpanText(html, ':text_OC_con') ?? '',
    objeto: readSpanText(html, ':text_ObjetoContrato') ?? '',
    estado: readSpanText(html, ':text_Estado') ?? '',
    finPresentacion: readSpanText(html, ':text_FechaPresentacionOfertaConHora'),
    enlace: readSpanText(html, ':text_EnlaceLicPLACE') ?? url,
  }
}
