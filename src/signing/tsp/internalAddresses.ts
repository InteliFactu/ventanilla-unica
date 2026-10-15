import { BlockList } from 'node:net'

/**
 * Loopback, private, link-local, CGNAT and unspecified ranges a TSA URL from
 * a sede page must not reach; an IPv4-mapped IPv6 address is checked against
 * the IPv4 rules by `BlockList` itself.
 */
export const internalAddresses = new BlockList()
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.168.0.0', 16],
] as const)
  internalAddresses.addSubnet(network, prefix, 'ipv4')
for (const [network, prefix] of [
  ['::', 127],
  ['fc00::', 7],
  ['fe80::', 10],
] as const)
  internalAddresses.addSubnet(network, prefix, 'ipv6')
