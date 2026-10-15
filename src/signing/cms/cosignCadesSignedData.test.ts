import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildCadesSignedData } from './buildCadesSignedData'
import { cosignCadesSignedData } from './cosignCadesSignedData'
import { verifySignerInfo } from './fixtures/verifySignerInfo'
import { readSignedDataParts } from './parsers/readSignedDataParts'

const first = buildTestIdentity('FIRST SIGNER')
const second = buildTestIdentity('SECOND SIGNER', undefined, 'ec')
const content = Buffer.from('contract to cosign')

describe('cosignCadesSignedData', () => {
  it('adds a second signer over the carried content, keeping the first', () => {
    const original = buildCadesSignedData(first, content)
    const cosigned = cosignCadesSignedData(second, original, {
      digest: 'sha512',
    })
    const parts = readSignedDataParts(cosigned)
    const before = readSignedDataParts(original).signerInfos[0]
    expect(parts.content).toEqual(content)
    expect(parts.signerInfos).toHaveLength(2)
    expect(parts.digestAlgorithms).toHaveLength(2)
    expect(parts.certificates).toHaveLength(2)
    expect(parts.signerInfos.some((info) => before?.equals(info))).toBe(true)
    const added = parts.signerInfos.find((info) => !before?.equals(info))
    expect(added && verifySignerInfo(added, second, content, 'sha512')).toBe(
      true,
    )
  })

  it('needs the content of a detached CMS, and the right one', () => {
    const detached = buildCadesSignedData(first, content, { mode: 'explicit' })
    expect(() => cosignCadesSignedData(second, detached)).toThrow(
      'needs the signed content',
    )
    const cosigned = cosignCadesSignedData(second, detached, { content })
    expect(readSignedDataParts(cosigned).content).toBeUndefined()
    const implicit = buildCadesSignedData(first, content)
    expect(() =>
      cosignCadesSignedData(second, implicit, {
        content: Buffer.from('other'),
      }),
    ).toThrow('not the content the CMS carries')
  })
})
