import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { readDerChildren } from '../asn1/parsers/readDerChildren'
import { readDerElement } from '../asn1/parsers/readDerElement'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildCadesSignedData } from './buildCadesSignedData'
import { cmsOids } from './cmsOids'
import { countersignCadesSignedData } from './countersignCadesSignedData'
import { verifySignerInfo } from './fixtures/verifySignerInfo'
import { readSignedDataParts } from './parsers/readSignedDataParts'
import { selectSignerInfoSignature } from './selectors/selectSignerInfoSignature'

const signer = buildTestIdentity('SIGNER')
const counter = buildTestIdentity('COUNTERSIGNER')

describe('countersignCadesSignedData', () => {
  it('countersigns the signature value, leaving the signed part as it was', () => {
    const original = buildCadesSignedData(signer, Buffer.from('act'))
    const target = readSignedDataParts(original).signerInfos[0]
    const countersigned = countersignCadesSignedData(counter, original)
    const info = readSignedDataParts(countersigned).signerInfos[0]
    if (!target || !info) throw new Error('no SignerInfo')
    const body = (der: Buffer): Buffer =>
      der.subarray(readDerElement(der, 0).valueStart)
    expect(body(info).subarray(0, body(target).length)).toEqual(body(target))
    const fields = readDerChildren(info, readDerElement(info, 0))
    const unsigned = fields.at(-1)
    const attribute = unsigned && readDerChildren(info, unsigned)[0]
    const [oid, values] = attribute ? readDerChildren(info, attribute) : []
    expect(
      oid &&
        info
          .subarray(oid.start, oid.end)
          .equals(derOid(cmsOids.countersignature)),
    ).toBe(true)
    const nested = values && readDerChildren(info, values)[0]
    expect(
      nested &&
        verifySignerInfo(
          info.subarray(nested.start, nested.end),
          counter,
          selectSignerInfoSignature(target),
        ),
    ).toBe(true)
  })
})
