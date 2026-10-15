import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { buildCadesSignedData } from '../cms/buildCadesSignedData'
import { cmsOids } from '../cms/cmsOids'
import { readSignedDataParts } from '../cms/parsers/readSignedDataParts'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildClassicPdf } from '../pades/fixtures/buildClassicPdf'
import { signPdf } from '../pades/signPdf'
import { signXml } from '../xades/signXml'
import { signAutoScript } from './signAutoScript'

const first = buildTestIdentity('FIRST')
const second = buildTestIdentity('SECOND')
const content = Buffer.from('<doc>synthetic content</doc>')
const request = {
  data: '',
  algorithm: 'SHA512withRSA',
  format: 'CAdES',
} as const

describe('multisignAutoScript', () => {
  it('cosigns a detached CAdES with the content the page sends', async () => {
    const signature = buildCadesSignedData(first, content, { mode: 'explicit' })
    const result = await signAutoScript(second, {
      ...request,
      operation: 'cosign',
      signature: signature.toString('base64'),
      data: content.toString('base64'),
    })
    const parts = readSignedDataParts(Buffer.from(result.signature, 'base64'))
    expect(parts.signerInfos).toHaveLength(2)
    expect(parts.content).toBeUndefined()
  })

  it('countersigns a CAdES signature', async () => {
    const signature = buildCadesSignedData(first, content)
    const result = await signAutoScript(second, {
      ...request,
      operation: 'countersign',
      signature: signature.toString('base64'),
    })
    expect(
      Buffer.from(result.signature, 'base64').includes(
        derOid(cmsOids.countersignature),
      ),
    ).toBe(true)
  })

  it('cosigns and countersigns XAdES, and cosigns PAdES by signing again', async () => {
    const xml = signXml(first, content, { mode: 'enveloped' }).xml
    for (const operation of ['cosign', 'countersign'] as const) {
      const result = await signAutoScript(second, {
        ...request,
        format: 'XAdES',
        operation,
        signature: xml.toString('base64'),
      })
      expect(
        Buffer.from(result.signature, 'base64')
          .toString()
          .match(/<ds:Signature /g),
      ).toHaveLength(2)
    }
    const pdf = signPdf(first, buildClassicPdf())
    const cosigned = await signAutoScript(second, {
      ...request,
      format: 'PAdES',
      operation: 'cosign',
      signature: pdf.toString('base64'),
    })
    expect(
      Buffer.from(cosigned.signature, 'base64')
        .toString('latin1')
        .match(/\/ByteRange/g),
    ).toHaveLength(2)
  })

  it('refuses PAdES countersignatures, FacturaE and a missing signature', async () => {
    for (const format of ['PAdES', 'FacturaE'])
      await expect(
        signAutoScript(second, {
          ...request,
          format,
          operation: 'countersign',
          signature: 'AA==',
        }),
      ).rejects.toThrow(`countersign is not supported for ${format}`)
    await expect(
      signAutoScript(second, { ...request, operation: 'cosign' }),
    ).rejects.toThrow('no signature to cosign')
  })
})
