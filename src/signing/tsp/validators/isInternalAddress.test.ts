import { describe, expect, it } from 'vitest'

import { isInternalAddress } from './isInternalAddress'

describe('isInternalAddress', () => {
  it.each(['8.8.8.8', '2a00:1450:4003:80e::200e', '2606:4700::1111'])(
    'lets the public address %s through',
    (address) => {
      expect(isInternalAddress(address)).toBe(false)
    },
  )

  it.each([
    '127.0.0.1',
    '0.0.0.0',
    '198.18.0.1',
    '224.0.0.1',
    '255.255.255.255',
    '::1',
    '::',
    '::127.0.0.1',
    '::ffff:127.0.0.1',
    '::ffff:8.8.8.8',
    '64:ff9b::7f00:1',
    '2002:7f00:1::',
    '2001:0:4136:e378:8000:63bf:3fff:fdd2',
    'fd00::1',
    'fe80::1',
    'ff02::1',
  ])('refuses %s', (address) => {
    expect(isInternalAddress(address)).toBe(true)
  })
})
