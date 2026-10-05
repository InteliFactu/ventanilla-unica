import type { HttpClient } from '../../http/types/HttpClient'
import type { DgsfpAttachment } from '../types/DgsfpAttachment'
import { callDgsfpService } from './callDgsfpService'

/** Ask the sede whether an uploaded file is still held for this form (`comprobarAdjuntoPresentacion`), as the review step does. */
export const checkAttachment = async (
  client: HttpClient,
  digest: string,
  numTelematico: string,
  attachment: DgsfpAttachment,
): Promise<void> => {
  const held = await callDgsfpService(
    client,
    digest,
    'RestService.svc/comprobarAdjuntoPresentacion',
    {
      numTelematico,
      nombreCampo: attachment.field,
      nombreArchivo: attachment.name,
      hash: attachment.hash,
    },
  )
  if (held !== true)
    throw new Error(`DGSFP: the sede does not hold ${attachment.name}`)
}
