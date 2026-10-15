import { isIP } from 'node:net'

import { globalUnicastAddresses } from '../globalUnicastAddresses'
import { internalAddresses } from '../internalAddresses'

/** Whether an IP address literal is one a TSA must not be reached at: any non-public IPv4 range, or IPv6 outside public global unicast. */
export const isInternalAddress = (address: string): boolean => {
  const family = isIP(address)
  if (family === 4) return internalAddresses.check(address, 'ipv4')
  return (
    family === 6 &&
    (!globalUnicastAddresses.check(address, 'ipv6') ||
      internalAddresses.check(address, 'ipv6'))
  )
}
