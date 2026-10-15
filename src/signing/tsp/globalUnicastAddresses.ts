import { BlockList } from 'node:net'

/** IPv6 global unicast, 2000::/3: the only IPv6 space a TSA may sit in (no loopback, IPv4-mapped or -compatible, NAT64, ULA, link-local or multicast). */
export const globalUnicastAddresses = new BlockList()
globalUnicastAddresses.addSubnet('2000::', 3, 'ipv6')
