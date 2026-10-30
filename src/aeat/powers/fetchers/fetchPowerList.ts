import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'
import { powerCounterpartField } from '../mappers/powerCounterpartField'
import { powerQueryName } from '../mappers/powerQueryName'
import type { AeatPowerDirection } from '../types/AeatPowerDirection'

/**
 * POST the ITTI-APOD query ("Consulta, prórroga y revocación de apoderamientos
 * otorgados", or its "recibidos" twin) with every filter empty: the search
 * button of the page, which only lists. Revoking or extending is a separate
 * signed step on the detail page and is never reached from here.
 */
export const fetchPowerList = async (
  client: HttpClient,
  direction: AeatPowerDirection,
): Promise<string> => {
  const query = powerQueryName(direction)
  const url = `${aeatBaseUrl}/wlpl/ITTI-APOD/${query}`
  const response = await client.request(url, {
    method: 'POST',
    referer: url,
    form: {
      [powerCounterpartField(direction)]: '',
      FORM_ESTADO_AUTORIZACION: '',
      FORM_TRAMITE: '',
      FORM_FECHA_VIGENCIA: '',
      CLASGTE: '20/0/',
      VERIFICAR_CAMPOS_REQUERIDOS: 'false',
      QUE_MODO: 'NORMAL',
      ESTADO_COLS: '1',
      NUM_RESULTADOS_RS: '0',
      VEZ: 'BUSCAR1',
      NOM_QUERY: `es.aeat.itti.apod.web.query.${query}`,
      COLUMNA_ORDEN: '',
      MODO_ORDEN: '',
    },
  })
  if (response.status !== 200)
    throw new Error(
      `AEAT: the apoderamientos list answered HTTP ${String(response.status)}`,
    )
  return response.text
}
