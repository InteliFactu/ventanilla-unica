import { inflateSync } from 'node:zlib'

import { maxDecodedStreamBytes } from '../../../signing/pades/maxDecodedStreamBytes'

/** Inflate one PDF stream body, or undefined when it is not zlib data (images, raw fonts). */
export const inflateStream = (raw: Buffer): Buffer | undefined => {
  try {
    return inflateSync(raw, { maxOutputLength: maxDecodedStreamBytes })
  } catch {
    return undefined
  }
}
