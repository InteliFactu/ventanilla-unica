import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { readDerChildren } from '../asn1/parsers/readDerChildren'
import { readDerElement } from '../asn1/parsers/readDerElement'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildCadesSignedData } from './buildCadesSignedData'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { countersignCadesSignedData } from './countersignCadesSignedData'
import { verifySignerInfo } from './fixtures/verifySignerInfo'
import { readSignedDataParts } from './parsers/readSignedDataParts'
import { selectSignerInfoSignature } from './selectors/selectSignerInfoSignature'
import { addUnsignedAttribute } from './writers/addUnsignedAttribute'
import { writeSignedData } from './writers/writeSignedData'

const signer = buildTestIdentity('SIGNER')
const counter = buildTestIdentity('COUNTERSIGNER')

describe('countersignCadesSignedData', () => {
  it.each([
    cmsOids.archiveTimeStamp,
    cmsOids.archiveTimeStampV2,
    cmsOids.archiveTimeStampV3,
  ])('preserves archived signatures by refusing target changes (%s)', (oid) => {
    const parts = readSignedDataParts(
      buildCadesSignedData(signer, Buffer.from('record')),
    )
    const archived = writeSignedData({
      ...parts,
      signerInfos: parts.signerInfos.map((info) =>
        addUnsignedAttribute(info, cmsAttribute(oid, [Buffer.from([0x30, 0])])),
      ),
    })
    expect(() =>
      countersignCadesSignedData(counter, archived, { target: 'leafs' }),
    ).toThrow('does not support archive timestamps')
  })

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
