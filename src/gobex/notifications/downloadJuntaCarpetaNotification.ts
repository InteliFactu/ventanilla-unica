import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithClave } from '../session/loginWithClave'
import { downloadCarpetaNotification } from './downloadCarpetaNotification'
import { findCarpetaNotification } from './fetchers/findCarpetaNotification'
import type { CarpetaDownload } from './types/CarpetaDownload'

/** `junta carpeta-descargar`: the PDF of a notification the holder already accepted, saved under `outDir`. */
export const downloadJuntaCarpetaNotification = async (
  client: HttpClient,
  id: string,
  outDir: string,
): Promise<CarpetaDownload> => {
  await loginWithClave(client)
  const located = await findCarpetaNotification(client, id)
  const files = await downloadCarpetaNotification(client, located, outDir)
  return { notification: located.record, files }
}
