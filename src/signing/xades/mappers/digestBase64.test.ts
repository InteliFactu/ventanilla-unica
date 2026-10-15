import { describe, expect, it } from 'vitest'

import { digestBase64 } from './digestBase64'

describe('digestBase64', () => {
  it('hashes strings and bytes alike with the named digest', () => {
    expect(digestBase64('sha256', 'abc')).toBe(
      'ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=',
    )
    expect(digestBase64('sha256', Buffer.from('abc'))).toBe(
      digestBase64('sha256', 'abc'),
    )
    expect(digestBase64('sha1', 'abc')).toBe('qZk+NkcGgWq6PiVxeFDCbJzQ2J0=')
  })
})
