import type { HttpClient } from '../../../http/types/HttpClient'
import { justiciaUrls } from '../../session/justiciaUrls'
import { postVisorAjax } from '../../session/postVisorAjax'
import type { VisorSession } from '../../session/types/VisorSession'
import type { JusticiaDocument } from '../types/JusticiaDocument'
import type { VisorCheckAnswer } from '../types/VisorCheckAnswer'
import type { VisorFile } from '../types/VisorFile'

/**
 * One document's bytes: `accesoExternoEjeCheckDocumento` (logged by the visor
 * as a "Consulta") clears it and names its extension, then
 * `getDocumentoByCodigoApache` returns it. Both name the `doc` tree, which is
 * what the visor's "Documentos" tab is called internally.
 */
export const fetchVisorDocument = async (
  client: HttpClient,
  session: VisorSession,
  document: JusticiaDocument,
): Promise<VisorFile> => {
  const check = await postVisorAjax(client, session, {
    codOpe: 'accesoExternoEjeCheckDocumento',
    codigoBarras: document.codigoBarras,
    nombreProcedimiento: session.procedimiento,
    idDoc: document.id,
    operacionAuditoria: 'Consulta',
    esExpediente: 'false',
    codExpediente: session.codExpediente,
    esEje: 'false',
    checkFirmado: 'true',
    nombreArbol: 'doc',
  })
  const answer = JSON.parse(check.text) as VisorCheckAnswer
  if (answer.result !== true)
    throw new Error(`Justicia: the visor refused document ${document.numero}`)
  const extension = (answer.extension ?? '.pdf').toLowerCase()
  const query = new URLSearchParams({
    action: 'getDocumentoByCodigoApache',
    filename: `doc${extension}`,
    idDoc: document.id,
    execution: session.execution,
    codigoBarras: document.codigoBarras,
    nombreArbol: 'doc',
  })
  const file = await client.request(
    `${justiciaUrls.visorDocument}?${query.toString()}`,
    { referer: session.url },
  )
  if (file.status !== 200)
    throw new Error(
      `Justicia: document ${document.numero} answered ${String(file.status)}`,
    )
  return { extension, bytes: file.body }
}
