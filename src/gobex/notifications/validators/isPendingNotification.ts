import type { GobexRecord } from '../../types/GobexRecord'

/** True for a notification still waiting to be accepted or rejected: opening it in the sede leads to the acceptance screen. */
export const isPendingNotification = (record: GobexRecord): boolean =>
  /^Pendiente/i.test(record['status'] ?? '')
