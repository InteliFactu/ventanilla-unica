import type { LookupAddress } from 'node:dns'
import { lookup } from 'node:dns/promises'

import { isInternalAddress } from './validators/isInternalAddress'

/** Every address `hostname` resolves to, refusing the name when any of them is internal. */
export const resolvePublicAddresses = async (
  hostname: string,
  family: number | undefined,
): Promise<readonly LookupAddress[]> => {
  const addresses = await lookup(hostname, { all: true, family: family ?? 0 })
  if (
    addresses.length === 0 ||
    addresses.some((entry) => isInternalAddress(entry.address))
  )
    throw new Error(
      `refused TSA ${hostname}: it resolves to an internal address`,
    )
  return addresses
}
