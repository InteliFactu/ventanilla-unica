import type { RayuelaTray } from '../types/RayuelaTray'
/** Only the inbox and the sent box are read; other trays are refused. */
export const validateRayuelaTray = (value: string | undefined): RayuelaTray => {
  const tray = (value ?? 'REC').toUpperCase()
  if (tray !== 'REC' && tray !== 'ENV')
    throw new Error('--bandeja must be REC (inbox) or ENV (sent)')
  return tray
}
