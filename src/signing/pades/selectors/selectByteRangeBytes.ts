import type { PreparedPdfSignature } from '../types/PreparedPdfSignature'

/** The bytes a signature or document timestamp covers: the whole file minus its /Contents. */
export const selectByteRangeBytes = (prepared: PreparedPdfSignature): Buffer =>
  Buffer.concat([
    prepared.file.subarray(0, prepared.contentsAt),
    prepared.file.subarray(prepared.contentsEnd),
  ])
