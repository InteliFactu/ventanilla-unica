import { generateKeyPairSync, verify } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { signData } from './signData'

describe('signData', () => {
  it('signs with the requested digest', () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    })
    const key = Buffer.from(privateKey.export({ type: 'pkcs8', format: 'pem' }))
    const data = Buffer.from('hash prepared by the portal')
    for (const digest of ['sha1', 'sha256', 'sha512'] as const) {
      const signature = signData({ cert: Buffer.alloc(0), key }, data, digest)
      expect(verify(digest, data, publicKey, signature)).toBe(true)
    }
  })

  it('signs ECDSA with an EC key', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ec', {
      namedCurve: 'P-256',
    })
    const key = Buffer.from(privateKey.export({ type: 'pkcs8', format: 'pem' }))
    const data = Buffer.from('token')
    const signature = signData({ cert: Buffer.alloc(0), key }, data, 'sha256')
    expect(verify('sha256', data, publicKey, signature)).toBe(true)
  })
})
