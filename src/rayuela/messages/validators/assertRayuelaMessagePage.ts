import { RAYUELA_MESSAGE_PAGE_SIZE } from '../RAYUELA_MESSAGE_PAGE_SIZE'

/** Reject an ignored offset, a page past the end or an incomplete response. */
export const assertRayuelaMessagePage = (
  offset: number,
  range: RegExpExecArray,
  rowCount: number,
): void => {
  const start = Number(range[1])
  const end = Number(range[2])
  const total = Number(range[3])
  if (
    !Number.isSafeInteger(total) ||
    start !== offset + 1 ||
    start > end ||
    end !== Math.min(offset + RAYUELA_MESSAGE_PAGE_SIZE, total) ||
    end - start + 1 !== rowCount
  )
    throw new Error(
      'The portal did not return the requested Rayuela message page',
    )
}
