import type { WriteResult } from '../../../write/types/WriteResult'
import type { GobexRecord } from '../../types/GobexRecord'
import type { CarpetaNotificationFiles } from './CarpetaNotificationFiles'

/**
 * `junta carpeta-comparecer`: the write result (the receipt is the files
 * written), the notification's grid row, and whether this run accepted it
 * (`true`), found it already accepted (`'already'`) or changed nothing.
 */
export type CarpetaAcceptance = WriteResult<CarpetaNotificationFiles> & {
  readonly notification: GobexRecord
  readonly accepted: boolean | 'already'
}
