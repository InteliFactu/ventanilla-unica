import { readRayuelaTodayMs } from './readRayuelaTodayMs'

/** Prefer the HTTP message date; the local clock is ambiguous across Madrid midnight. */
export const resolveRayuelaResponseDay = (
  dateHeader: string | readonly string[] | undefined,
  requestedAt: Date,
  receivedAt: Date,
): number | null => {
  if (typeof dateHeader === 'string') {
    const portalDate = new Date(dateHeader)
    if (
      Number.isFinite(portalDate.getTime()) &&
      portalDate.toUTCString() === dateHeader
    )
      return readRayuelaTodayMs(portalDate)
  }
  const day = readRayuelaTodayMs(receivedAt)
  return readRayuelaTodayMs(requestedAt) === day ? day : null
}
