import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../fixtures/buildTestIdentity'
import { parseXmlDocument } from '../../xml/parsers/parseXmlDocument'
import { parseCertificateChain } from '../parsers/parseCertificateChain'
import { xadesUris } from '../xadesUris'
import { resolveSignatureContext } from './resolveSignatureContext'

const certificates = parseCertificateChain(buildTestIdentity().cert)
const xml = { bytes: Buffer.alloc(0), document: parseXmlDocument('<a/>') }
const binary = { bytes: Buffer.alloc(0), document: undefined }

describe('resolveSignatureContext', () => {
  it('applies the documented defaults', () => {
    const context = resolveSignatureContext(
      certificates,
      { mode: 'enveloped' },
      xml,
    )
    expect(context).toMatchObject({
      prefixes: { ds: 'ds', xades: 'xades' },
      keyInfo: { chain: true, keyValue: false, reference: true },
      signingCertificateVersion: 1,
      signatureDigest: 'sha256',
      referencesDigest: 'sha256',
      signerRoles: [],
      contentC14nTransform: true,
      objectIdentifier: 'urn:oid:1.2.840.10003.5.109.10',
      policy: undefined,
      mimeType: 'text/xml',
      encoding: undefined,
    })
    expect(context.signingTime).toBeInstanceOf(Date)
  })
  it('keeps the caller overrides and marks base64 content', () => {
    const signingTime = new Date(0)
    const context = resolveSignatureContext(
      certificates,
      {
        mode: 'enveloping',
        prefixes: { ds: 'dsig' },
        keyInfo: { keyValue: true },
        signingCertificateVersion: 2,
        signingTime,
        signatureDigest: 'sha512',
        referencesDigest: 'sha1',
      },
      binary,
    )
    expect(context).toMatchObject({
      prefixes: { ds: 'dsig', xades: 'xades' },
      keyInfo: { chain: true, keyValue: true },
      signingCertificateVersion: 2,
      signingTime,
      signatureDigest: 'sha512',
      referencesDigest: 'sha1',
      mimeType: 'application/octet-stream',
      encoding: xadesUris.base64,
    })
  })
})
