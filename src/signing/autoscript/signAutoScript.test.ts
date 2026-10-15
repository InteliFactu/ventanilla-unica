import { verify, X509Certificate } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { cmsOids } from '../cms/cmsOids'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildClassicPdf } from '../pades/fixtures/buildClassicPdf'
import { extractSignedParts } from '../pades/fixtures/extractSignedParts'
import { verifyDetachedCms } from '../pades/fixtures/verifyDetachedCms'
import { answerTestTimestamp } from '../tsp/fixtures/answerTestTimestamp'
import { signAutoScript } from './signAutoScript'

const identity = buildTestIdentity()
const marker = 'synthetic content marker'
const base64 = (text: string): string => Buffer.from(text).toString('base64')
const decoded = (signature: string): string =>
  Buffer.from(signature, 'base64').toString('latin1')

describe('signAutoScript', () => {
  it('signs NONE as raw PKCS#1 and returns the certificate DER', async () => {
    const result = await signAutoScript(identity, {
      data: base64('prepared'),
      algorithm: 'SHA256withRSA',
      format: 'NONE',
    })
    const certificate = new X509Certificate(
      Buffer.from(result.certificate, 'base64'),
    )
    expect(
      verify(
        'sha256',
        Buffer.from('prepared'),
        certificate.publicKey,
        Buffer.from(result.signature, 'base64'),
      ),
    ).toBe(true)
  })

  it('signs CAdES explicit by default, without the content', async () => {
    const result = await signAutoScript(identity, {
      data: base64(marker),
      algorithm: 'SHA512withRSA',
      format: 'CAdES',
    })
    expect(decoded(result.signature)).not.toContain(marker)
  })

  it('signs CAdES implicit under the AGE policy for small data', async () => {
    const result = await signAutoScript(identity, {
      data: base64(marker),
      algorithm: 'SHA256withRSA',
      format: 'CAdEStri',
      extraParams: 'expPolicy=FirmaAGE',
    })
    expect(decoded(result.signature)).toContain(marker)
  })

  it('signs XAdES enveloping by default with the claimed roles', async () => {
    const result = await signAutoScript(identity, {
      data: base64('<doc>synthetic</doc>'),
      algorithm: 'SHA256withRSA',
      format: 'XAdES',
      extraParams: 'signerClaimedRoles=tester|reviewer',
    })
    const xml = decoded(result.signature)
    expect(xml.startsWith('<ds:Signature') || xml.includes('<ds:Object')).toBe(
      true,
    )
    expect(xml).toContain('>tester<')
    expect(xml).toContain('>reviewer<')
  })

  it('signs FacturaE enveloped, claiming emisor', async () => {
    const result = await signAutoScript(identity, {
      data: base64('<fe:Facturae xmlns:fe="urn:test">synthetic</fe:Facturae>'),
      algorithm: 'SHA512withRSA',
      format: 'FacturaE',
    })
    const xml = decoded(result.signature)
    expect(xml).toContain('synthetic<ds:Signature')
    expect(xml).toContain('>emisor<')
  })

  it('signs PAdES with the reason and location', async () => {
    const result = await signAutoScript(identity, {
      data: buildClassicPdf().toString('base64'),
      algorithm: 'SHA256withRSA',
      format: 'PAdES',
      extraParams: 'signReason=Synthetic test\nsignatureProductionCity=Nowhere',
    })
    const pdf = decoded(result.signature)
    expect(pdf).toContain('/Reason (Synthetic test)')
    expect(pdf).toContain('/Location (Nowhere)')
  })

  it.each([
    ['an unknown format', { format: 'ASiC-S' }],
    ['empty data', { data: '' }],
    ['XAdES explicit', { extraParams: 'mode=explicit' }],
    ['an unknown CAdES mode', { format: 'CAdES', extraParams: 'mode=other' }],
    [
      'another PDF subfilter',
      {
        format: 'PAdES',
        extraParams: 'signatureSubFilter=adbe.x509.rsa_sha1',
      },
    ],
    ['another named policy', { extraParams: 'expPolicy=FirmaAGE18' }],
    ['an EC algorithm for an RSA key', { algorithm: 'SHA256withECDSA' }],
  ])('refuses %s', async (_name, change) => {
    await expect(
      signAutoScript(identity, {
        data: base64('<doc>synthetic</doc>'),
        algorithm: 'SHA256withRSA',
        format: 'XAdES',
        ...change,
      }),
    ).rejects.toThrow()
  })

  it('signs CAdES with an EC certificate', async () => {
    const ec = buildTestIdentity(undefined, undefined, 'ec')
    const result = await signAutoScript(ec, {
      data: base64(marker),
      algorithm: 'SHA256withECDSA',
      format: 'CAdES',
    })
    expect(
      verifyDetachedCms(
        Buffer.from(result.signature, 'base64'),
        Buffer.from(marker),
        ec.cert,
      ),
    ).toBe(true)
  })

  it('timestamps CAdES and PAdES when tsaURL names a TSA', async () => {
    for (const [format, data] of [
      ['CAdES', base64(marker)],
      ['PAdES', buildClassicPdf().toString('base64')],
    ] as const) {
      const result = await signAutoScript(
        identity,
        {
          data,
          algorithm: 'SHA256withRSA',
          format,
          extraParams:
            'tsaURL=https://tsa.example.test/tsr\ntsaHashAlgorithm=SHA-256',
        },
        answerTestTimestamp,
      )
      const signed = Buffer.from(result.signature, 'base64')
      const cms = format === 'PAdES' ? extractSignedParts(signed).cms : signed
      expect(cms.includes(derOid(cmsOids.signatureTimeStampToken))).toBe(true)
    }
  })
})
