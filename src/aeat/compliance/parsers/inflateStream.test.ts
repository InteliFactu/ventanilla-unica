import { deflateSync } from 'node:zlib'

import { describe, expect, it } from 'vitest'

import { inflateStream } from './inflateStream'

describe('inflateStream', () => {
  it('inflates zlib data', () => {
    expect(inflateStream(deflateSync('BT ET'))?.toString()).toBe('BT ET')
  })

  it('answers undefined for anything else', () => {
    expect(inflateStream(Buffer.from([0xff, 0xd8, 0xff]))).toBeUndefined()
  })
})
