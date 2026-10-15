import { BlockList } from 'node:net'

/**
 * Ranges a TSA URL from a sede page must not reach: IPv4 loopback, private,
 * link-local, CGNAT, unspecified, benchmarking, documentation, multicast and
 * reserved; and the IPv6 ranges inside global unicast that tunnel to an
 * arbitrary IPv4 address (Teredo, 6to4) or are documentation only. Every
 * other IPv6 address outside `globalUnicastAddresses` is refused too.
 */
export const internalAddresses = new BlockList()
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const)
  internalAddresses.addSubnet(network, prefix, 'ipv4')
for (const [network, prefix] of [
  ['2001::', 32],
  ['2001:db8::', 32],
  ['2002::', 16],
] as const)
  internalAddresses.addSubnet(network, prefix, 'ipv6')
