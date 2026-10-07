import { readText } from '../parsers/readText'
import type { StaNotification } from '../types/StaNotification'
import type { StaNotificationScope } from '../types/StaNotificationScope'
import type { StaRow } from '../types/StaRow'
import { isoFromStaTimestamp } from './isoFromStaTimestamp'

/** One `ds_NOTIFICACIONES_*` row as a notification. */
export const mapNotification = (
  row: StaRow,
  scope: StaNotificationScope,
): StaNotification => ({
  role: scope.role,
  tab: scope.tab,
  reference: readText(row, 'numReferencia'),
  expediente: readText(row, 'expediente'),
  subject: readText(row, 'reportDescription'),
  action: readText(row, 'actuacion'),
  status: readText(row, 'notifStatus'),
  madeAvailableAt: readText(row, 'puestaDisp').replace(
    /^(\S+) (\d{2}:\d{2}:\d{2}).*$/,
    '$1T$2',
  ),
  resolvedAt: isoFromStaTimestamp(row['statusDate']),
  recipient: readText(row, 'personFullName'),
})
