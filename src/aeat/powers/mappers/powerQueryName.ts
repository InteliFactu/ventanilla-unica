import type { AeatPowerDirection } from '../types/AeatPowerDirection'

/** The ITTI-APOD query servlet for each direction: the holder as poderdante, or as apoderado. */
export const powerQueryName = (direction: AeatPowerDirection): string =>
  direction === 'granted' ? 'SvApodPoderQuery' : 'SvApodApodeQuery'
