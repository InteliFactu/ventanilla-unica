import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { fetchExpedienteDetail } from './fetchers/fetchExpedienteDetail'
import { fetchExpedienteList } from './fetchers/fetchExpedienteList'
import { parseExpedienteActs } from './parsers/parseExpedienteActs'
import { parseExpedienteCount } from './parsers/parseExpedienteCount'
import { parseExpedienteRows } from './parsers/parseExpedienteRows'
import type { AeatExpediente } from './types/AeatExpediente'
import type { AeatExpedientesReport } from './types/AeatExpedientesReport'

/** Read Mis Expedientes for the currently represented holder, including listed acts. */
export const listAeatExpedientes = async (
  client: HttpClient,
  nif: string,
): Promise<AeatExpedientesReport> => {
  await openAeatSession(client)
  const list = await fetchExpedienteList(client)
  if (!list.includes(`Mis expedientes ${nif}`))
    throw new Error(`AEAT: Mis Expedientes is not showing holder ${nif}`)
  const rows = parseExpedienteRows(list)
  if (rows.length !== parseExpedienteCount(list))
    throw new Error('AEAT: expediente list count does not match its rows')
  const expedientes: AeatExpediente[] = []
  for (const row of rows) {
    const detail = await fetchExpedienteDetail(client, row.detailUrl)
    if (!detail.includes(`Detalle ${row.reference}`))
      throw new Error(`AEAT: wrong detail page for ${row.reference}`)
    const acts = parseExpedienteActs(detail)
    const startDate =
      acts.find((act) =>
        /inicio|iniciaci[oó]n|presentaci[oó]n solicitud/i.test(act.description),
      )?.date ?? null
    const endDate =
      acts.findLast((act) =>
        /terminaci[oó]n de procedimiento/i.test(act.description),
      )?.date ?? null
    expedientes.push({ ...row, acts, startDate, endDate })
  }
  return {
    nif,
    count: expedientes.length,
    expedientes,
    coverage:
      'AEAT Mis Expedientes only; separate TEA tribunal proceedings are not covered',
  }
}
