import {
  createHash,
  createPublicKey,
  verify,
  X509Certificate,
} from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { readDerChildren } from '../asn1/parsers/readDerChildren'
import { readDerElement } from '../asn1/parsers/readDerElement'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildAttachedSignedData } from './buildAttachedSignedData'

describe('buildAttachedSignedData', () => {
  it('carries the content and signs attributes holding its digest', () => {
    const identity = buildTestIdentity()
    const content = Buffer.from('token to sign')
    const der = buildAttachedSignedData(identity, content)
    const [, wrapper] = readDerChildren(der, readDerElement(der, 0))
    const signedData = wrapper && readDerChildren(der, wrapper)[0]
    const fields = signedData ? readDerChildren(der, signedData) : []
    expect(fields.map((field) => field.tag)).toEqual([
      0x02, 0x31, 0x30, 0xa0, 0x31,
    ])
    const encapsulated = fields[2]
    if (!encapsulated) throw new Error('no encapsulated content')
    expect(
      der.subarray(encapsulated.start, encapsulated.end).includes(content),
    ).toBe(true)
    const signerSet = fields[4]
    const signer = signerSet && readDerChildren(der, signerSet)[0]
    const parts = signer ? readDerChildren(der, signer) : []
    const [attrs, , signature] = parts.slice(3)
    if (!attrs || !signature) throw new Error('signer info incomplete')
    const signedBytes = Buffer.from(der.subarray(attrs.start, attrs.end))
    signedBytes[0] = 0x31
    const digest = createHash('sha256').update(content).digest()
    expect(signedBytes.includes(digest)).toBe(true)
    const key = createPublicKey(
      new X509Certificate(identity.cert).publicKey.export({
        type: 'spki',
        format: 'pem',
      }),
    )
    const value = der.subarray(signature.valueStart, signature.end)
    expect(verify('sha256', signedBytes, key, value)).toBe(true)
  })
})
