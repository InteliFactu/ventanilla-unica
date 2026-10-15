import { X509Certificate, verify } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { certificateDerBase64 } from './certificateDerBase64'
import { signAutoscriptData } from './signAutoscriptData'

describe('signAutoscriptData', () => {
  it('signs the decoded bytes with PKCS#1 SHA-256, verifiable by the certificate', () => {
    const identity = buildTestIdentity()
    const data = Buffer.from('<prepared>synthetic hash input</prepared>')
    const signature = signAutoscriptData(
      identity,
      data.toString('base64'),
      'SHA256withRSA',
    )
    const certificate = new X509Certificate(
      Buffer.from(certificateDerBase64(identity), 'base64'),
    )
    expect(
      verify(
        'sha256',
        data,
        certificate.publicKey,
        Buffer.from(signature, 'base64'),
      ),
    ).toBe(true)
  })

  it('signs with the digest the portal names', () => {
    const identity = buildTestIdentity()
    const data = Buffer.from('prepared')
    const signature = signAutoscriptData(
      identity,
      data.toString('base64'),
      'SHA512withRSA',
    )
    expect(
      verify(
        'sha512',
        data,
        new X509Certificate(identity.cert).publicKey,
        Buffer.from(signature, 'base64'),
      ),
    ).toBe(true)
  })

  it('refuses an unknown algorithm or another key family', () => {
    expect(() =>
      signAutoscriptData(buildTestIdentity(), 'AA==', 'MD5withRSA'),
    ).toThrow(/unsupported AutoScript algorithm/)
    expect(() =>
      signAutoscriptData(buildTestIdentity(), 'AA==', 'SHA256withECDSA'),
    ).toThrow(/asks for an EC signature/)
  })

  it('refuses empty data', () => {
    expect(() =>
      signAutoscriptData(buildTestIdentity(), '', 'SHA256withRSA'),
    ).toThrow(/no data to sign/)
  })
})
