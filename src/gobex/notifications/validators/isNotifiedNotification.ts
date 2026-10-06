import type { GobexRecord } from '../../types/GobexRecord'

/** True for a notification the holder already accepted ("Notificado"): opening it offers the PDF downloads. */
export const isNotifiedNotification = (record: GobexRecord): boolean =>
  /^Notificado/i.test(record['status'] ?? '')
