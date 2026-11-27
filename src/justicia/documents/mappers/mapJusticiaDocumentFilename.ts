import { createHash } from 'node:crypto'

import { safeFileStem } from '../../../dehu/documents/mappers/safeFileStem'
import type { VisorSession } from '../../session/types/VisorSession'
import type { JusticiaDocument } from '../types/JusticiaDocument'

/** Keep the event number readable and use the visor's document identity to disambiguate it. */
export const mapJusticiaDocumentFilename = (
  session: VisorSession,
  document: JusticiaDocument,
  extension: string,
): string => {
  const fingerprint = createHash('sha256')
    .update(
      JSON.stringify([
        session.codExpediente,
        document.id,
        document.codigoBarras,
      ]),
    )
    .digest('hex')
    .slice(0, 24)
  return safeFileStem(
    `justicia-${session.procedimiento}-${document.numero.padStart(3, '0')}-${fingerprint}${extension}`,
  )
}
