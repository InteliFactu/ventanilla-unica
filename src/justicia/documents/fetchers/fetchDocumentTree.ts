import type { HttpClient } from '../../../http/types/HttpClient'
import { postVisorAjax } from '../../session/postVisorAjax'
import type { VisorSession } from '../../session/types/VisorSession'
import type { VisorTreeAnswer } from '../types/VisorTreeAnswer'
import type { VisorTreeNode } from '../types/VisorTreeNode'

/**
 * The expediente's document tree. The minimal body is deliberate: the page's
 * own call adds the `mostrarTiposDocumentales`/`mostrarSoloDocumentos` view
 * flags, and any value sent for them makes the visor answer HTTP 902.
 */
export const fetchDocumentTree = async (
  client: HttpClient,
  session: VisorSession,
): Promise<readonly VisorTreeNode[]> => {
  const response = await postVisorAjax(client, session, {
    codOpe: 'accesoExternoEjeGetArbolByCodExpediente',
    codExpediente: session.codExpediente,
    orden: 'asc',
  })
  const answer = JSON.parse(response.text) as VisorTreeAnswer
  return answer.tree ?? []
}
