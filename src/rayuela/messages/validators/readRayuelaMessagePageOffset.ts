import { RAYUELA_MESSAGE_PAGE_SIZE } from '../RAYUELA_MESSAGE_PAGE_SIZE'

/** Convert a one-based page number to the request's zero-based row offset. */
export const readRayuelaMessagePageOffset = (value = '1'): number => {
  const offset = (Number(value) - 1) * RAYUELA_MESSAGE_PAGE_SIZE
  if (
    !/^\d+$/.test(value) ||
    offset < 0 ||
    !Number.isSafeInteger(offset + RAYUELA_MESSAGE_PAGE_SIZE)
  )
    throw new Error(
      '--pagina must be a positive integer within the supported range',
    )
  return offset
}
