import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { buildCadesSignedData } from '../cms/buildCadesSignedData'
import { cmsOids } from '../cms/cmsOids'
import { readSignedDataParts } from '../cms/parsers/readSignedDataParts'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { signAutoScript } from './signAutoScript'

const first = buildTestIdentity('FIRST')
const second = buildTestIdentity('SECOND')
const content = Buffer.from('synthetic content')
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

  it('refuses other formats and a missing signature', async () => {
    await expect(
      signAutoScript(second, {
        ...request,
        format: 'XAdES',
        operation: 'countersign',
        signature: 'AA==',
      }),
    ).rejects.toThrow('only supported for CAdES')
    await expect(
      signAutoScript(second, { ...request, operation: 'cosign' }),
    ).rejects.toThrow('no signature to cosign')
  })
})
