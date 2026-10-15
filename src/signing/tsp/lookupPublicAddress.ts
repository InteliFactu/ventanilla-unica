/* eslint-disable promise/prefer-await-to-callbacks, promise/prefer-await-to-then -- Node's socket `lookup` option is a callback API; this file is the adapter to it */
import type { LookupFunction } from 'node:net'

import { resolvePublicAddresses } from './resolvePublicAddresses'

/**
 * The TSA socket's `lookup`: `resolvePublicAddresses` behind Node's callback
 * signature, so the address checked is the address connected to (no DNS
 * rebinding between a check and the request).
 */
export const lookupPublicAddress: LookupFunction = (
  hostname,
  options,
  answer,
) => {
  const family = typeof options.family === 'number' ? options.family : 0
  void resolvePublicAddresses(hostname, family).then(
    ([first, ...rest]) => {
      if (first === undefined) return
      if (options.all === true) answer(null, [first, ...rest])
      else answer(null, first.address, first.family)
    },
    (error: unknown) => {
      answer(error instanceof Error ? error : new Error(String(error)), '', 0)
    },
  )
}
