import type { GobexRecord } from '../../types/GobexRecord'
import type { CarpetaNotificationFiles } from './CarpetaNotificationFiles'

/** `junta carpeta-descargar`: the notification's grid row and the files written. */
export type CarpetaDownload = {
  readonly notification: GobexRecord
  readonly files: CarpetaNotificationFiles
}
