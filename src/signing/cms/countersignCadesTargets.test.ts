import { describe, expect, it } from 'vitest'

import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import { readDerChildren } from '../asn1/parsers/readDerChildren'
import { readDerElement } from '../asn1/parsers/readDerElement'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildCadesSignedData } from './buildCadesSignedData'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { cosignCadesSignedData } from './cosignCadesSignedData'
import { countersignCadesSignedData } from './countersignCadesSignedData'
import { verifySignerInfo } from './fixtures/verifySignerInfo'
import { readSignedDataParts } from './parsers/readSignedDataParts'
import { selectSignerInfoSignature } from './selectors/selectSignerInfoSignature'
import { addUnsignedAttribute } from './writers/addUnsignedAttribute'
import { writeSignedData } from './writers/writeSignedData'

const signer = buildTestIdentity('ROOT')
const first = buildTestIdentity('EXISTING COUNTERSIGNER')
const other = buildTestIdentity('OTHER ROOT')
const next = buildTestIdentity('NEW COUNTERSIGNER')
const content = Buffer.from('detached content')
const unsigned = cmsAttribute('1.2.3.4', [derOctetString(Buffer.from('keep'))])

const readCounters = (info: Buffer): readonly Buffer[] => {
  const fields = readDerChildren(info, readDerElement(info, 0))
  const attributes = fields.find((field) => field.tag === 0xa1)
  if (!attributes) return []
  return readDerChildren(info, attributes).flatMap((attribute) => {
    const [oid, values] = readDerChildren(info, attribute)
    if (
      !oid ||
      !values ||
      !info
        .subarray(oid.start, oid.end)
        .equals(derOid(cmsOids.countersignature))
    )
      return []
    return readDerChildren(info, values).map((child) =>
      info.subarray(child.start, child.end),
    )
  })
}

const expectSignature = (
  infos: readonly Buffer[],
  identity: ReturnType<typeof buildTestIdentity>,
  signed: Buffer,
): Buffer => {
  const info = infos.find((candidate) =>
    verifySignerInfo(candidate, identity, signed),
  )
  if (!info) throw new Error('Expected a valid SignerInfo')
  return info
}

const mixedTree = (): Buffer => {
  const original = buildCadesSignedData(signer, content, { mode: 'explicit' })
  const nested = countersignCadesSignedData(first, original)
  const parts = readSignedDataParts(nested)
  const annotated = writeSignedData({
    ...parts,
    signerInfos: parts.signerInfos.map((info) =>
      addUnsignedAttribute(info, unsigned),
    ),
  })
  return cosignCadesSignedData(other, annotated, { content })
}

describe('CAdES countersignature targets', () => {
  it.each([
    ['tree', 2, 1],
    ['leafs', 1, 1],
    [undefined, 2, 0],
  ] as const)(
    'walks only the selected original signers for target %s',
    (target, rootCount, firstCount) => {
      const original = mixedTree()
      const signedParts = readSignedDataParts(
        countersignCadesSignedData(next, original, { target }),
      )
      expect(signedParts.content).toBeUndefined()
      const root = expectSignature(signedParts.signerInfos, signer, content)
      const second = expectSignature(signedParts.signerInfos, other, content)
      expect(root.includes(unsigned)).toBe(true)
      const rootCounters = readCounters(root)
      expect(rootCounters).toHaveLength(rootCount)
      const existing = expectSignature(
        rootCounters,
        first,
        selectSignerInfoSignature(root),
      )
      if (rootCount === 2)
        expectSignature(rootCounters, next, selectSignerInfoSignature(root))
      const children = readCounters(existing)
      expect(children).toHaveLength(firstCount)
      if (firstCount === 1)
        expectSignature(children, next, selectSignerInfoSignature(existing))
      expect(children.flatMap(readCounters)).toHaveLength(0)
      const secondCounters = readCounters(second)
      expect(secondCounters).toHaveLength(1)
      expectSignature(secondCounters, next, selectSignerInfoSignature(second))
    },
  )
})
