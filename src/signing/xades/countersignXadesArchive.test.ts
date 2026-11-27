import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { countersignXadesSignature } from './countersignXadesSignature'
import { hasXmlsec } from './fixtures/hasXmlsec'
import { listSignatureIds } from './fixtures/listSignatureIds'
import { xmlsecVerifies } from './fixtures/xmlsecVerifies'
import { signXml } from './signXml'

const identity = buildTestIdentity('ARCHIVE')
const document = Buffer.from('<doc>synthetic archive fixture</doc>')
const signed = signXml(identity, document, { mode: 'enveloped' }).xml

const appendUnsignedArchive = (xml: Buffer, stamp: string): Buffer =>
  Buffer.from(
    xml
      .toString()
      .replace(
        '</xades:QualifyingProperties>',
        `<xades:UnsignedProperties><xades:UnsignedSignatureProperties>${stamp}</xades:UnsignedSignatureProperties></xades:UnsignedProperties></xades:QualifyingProperties>`,
      ),
  )

describe('XAdES archive timestamp protection', () => {
  it.each([
    ['v1.2.2', 'leafs'],
    ['v1.3.2', 'tree'],
    ['v1.4.1', 'leafs'],
  ] as const)(
    'refuses an archive timestamp in %s while selecting %s',
    (version, target) => {
      const archive = appendUnsignedArchive(
        signed,
        `<stamp:ArchiveTimeStamp xmlns:stamp="http://uri.etsi.org/01903/${version}#"/>`,
      )
      expect(() =>
        countersignXadesSignature(identity, archive, { target }),
      ).toThrow('XAdES archive timestamp prevents countersigning')
    },
  )

  it('checks an original nested archive before using signing material', () => {
    const nested = countersignXadesSignature(identity, signed)
    const archived = appendUnsignedArchive(nested, '<xades:ArchiveTimeStamp/>')
    const unusableKey = { ...identity, key: Buffer.from('not a signing key') }
    expect(() =>
      countersignXadesSignature(unusableKey, archived, { target: 'tree' }),
    ).toThrow('XAdES archive timestamp prevents countersigning')
  })

  it.skipIf(!hasXmlsec)(
    'preserves unrelated elements named ArchiveTimeStamp',
    () => {
      const untouched = appendUnsignedArchive(
        signed,
        '<example:ArchiveTimeStamp xmlns:example="urn:synthetic:unrelated"/>',
      )
      const result = countersignXadesSignature(identity, untouched, {
        target: 'leafs',
      })
      expect(result.toString()).toContain('urn:synthetic:unrelated')
      const ids = listSignatureIds(result)
      expect(ids).toHaveLength(2)
      for (const id of ids)
        expect(xmlsecVerifies(result, undefined, id)).toBe('')
    },
  )
})
