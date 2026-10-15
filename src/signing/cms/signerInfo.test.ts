import { X509Certificate } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { derNull } from '../asn1/derNull'
import { readCertificateParts } from '../asn1/parsers/readCertificateParts'
import { readDerChildren } from '../asn1/parsers/readDerChildren'
import { readDerElement } from '../asn1/parsers/readDerElement'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { signerInfo } from './signerInfo'

describe('signerInfo', () => {
  it('lays out the six SignerInfo fields with implicit [0] attributes', () => {
    const signer = readCertificateParts(
      new X509Certificate(buildTestIdentity().cert).raw,
    )
    const der = signerInfo({
      signer,
      digest: 'sha256',
      attributes: [derNull()],
      signature: Buffer.from([9]),
    })
    const fields = readDerChildren(der, readDerElement(der, 0))
    expect(fields.map((field) => field.tag)).toEqual([
      0x02, 0x30, 0x30, 0xa0, 0x30, 0x04,
    ])
  })
})
