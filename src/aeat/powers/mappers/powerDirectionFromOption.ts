import type { AeatPowerDirection } from '../types/AeatPowerDirection'

/** `--tipo otorgados` (the default) or `--tipo recibidos`; anything else is an error. */
export const powerDirectionFromOption = (
  value: string | undefined,
): AeatPowerDirection => {
  if (value === undefined || value === 'otorgados') return 'granted'
  if (value === 'recibidos') return 'received'
  throw new Error('--tipo must be otorgados or recibidos')
}
