import { isIP } from 'node:net'

import { internalAddresses } from '../internalAddresses'

/** Whether an IP address literal lies in a loopback, private, link-local or CGNAT range. */
export const isInternalAddress = (address: string): boolean => {
  const family = isIP(address)
  return (
    family !== 0 &&
    internalAddresses.check(address, family === 4 ? 'ipv4' : 'ipv6')
  )
}
