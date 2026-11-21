import type { HttpClient } from '../../../http/types/HttpClient'
import { censusWindowUrl } from '../mappers/censusWindowUrl'
import type { DraftFileHeader } from '../types/DraftFileHeader'
import type { DraftFileHolder } from '../types/DraftFileHolder'

/**
 * Identify the holder in the census window, as the browser does before the
 * presentation form: the form opens only for the holder, exercise and period
 * identified here. Changes nothing at the AEAT.
 */
export const identifyCensusHolder = async (
  client: HttpClient,
  header: DraftFileHeader,
  holder: DraftFileHolder,
): Promise<void> => {
  const url = censusWindowUrl(header.modelo)
  await client.request(url)
  await client.request(url, {
    method: 'POST',
    form: {
      NIF: holder.nif,
      NOMBRE: holder.nombre,
      EJERCICIO: header.ejercicio,
      PERIODO: header.periodo,
      ACCION: 'identificar',
      ORIGEN: `PRE${header.modelo}`,
    },
    referer: url,
  })
}
