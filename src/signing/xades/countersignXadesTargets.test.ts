import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { cosignXadesSignature } from './cosignXadesSignature'
import { countersignXadesSignature } from './countersignXadesSignature'
import { hasXmlsec } from './fixtures/hasXmlsec'
import { listSignatureIds } from './fixtures/listSignatureIds'
import { xmlsecVerifies } from './fixtures/xmlsecVerifies'
import { signXml } from './signXml'

const signer = buildTestIdentity('ROOT')
const counter = buildTestIdentity('COUNTER')
const document = Buffer.from('<doc><item>synthetic</item></doc>')

describe('XAdES countersignature targets', () => {
  it('refuses an ambiguous SignatureValue ID instead of countersigning the payload', () => {
    const payload = Buffer.from(
      '<doc><value Id="root-SignatureValue">payload</value></doc>',
    )
    const root = signXml(signer, payload, {
      mode: 'enveloped',
      ids: { signature: 'root' },
    }).xml
    expect(() =>
      countersignXadesSignature(counter, root, { target: 'tree' }),
    ).toThrow('ambiguous XAdES reference Id "root-SignatureValue"')
  })

  it('refuses an element that has no direct ds:SignedInfo', () => {
    const signed = signXml(signer, document, { mode: 'enveloped' }).xml
    const incomplete = Buffer.from(
      signed
        .toString()
        .replace(/<ds:SignedInfo\b[^>]*>[\s\S]*?<\/ds:SignedInfo>/, ''),
    )
    expect(() =>
      countersignXadesSignature(counter, incomplete, { target: 'tree' }),
    ).toThrow('the XML carries no signature')
  })

  it.skipIf(!hasXmlsec).each([
    ['leafs', ['child', 'other', 'root']],
    ['tree', ['child', 'other', 'root', 'root']],
    [undefined, ['other', 'root', 'root']],
  ] as const)(
    'countersigns the selected original nodes for %s',
    (target, references) => {
      const root = signXml(signer, document, {
        mode: 'enveloped',
        ids: { signature: 'root' },
      }).xml
      const nested = countersignXadesSignature(counter, root, {
        ids: { signature: 'child' },
      })
      const mixed = cosignXadesSignature(signer, nested, {
        ids: { signature: 'other' },
      })
      const result = countersignXadesSignature(counter, mixed, { target })
      expect(
        [...result.toString().matchAll(/URI="#(\w+)-SignatureValue"/g)]
          .map((match) => match[1])
          .sort(),
      ).toEqual(references)
      const ids = listSignatureIds(result)
      expect(ids).toHaveLength(references.length + 2)
      for (const id of ids)
        expect(xmlsecVerifies(result, undefined, id)).toBe('')
    },
  )

  it.skipIf(!hasXmlsec)(
    'leaves the signed payload untouched when it contains its own signature',
    () => {
      const payload = Buffer.from(
        '<doc xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#">' +
          '<ds:Signature Id="payload"><ds:SignedInfo/><ds:SignatureValue Id="payload-SignatureValue">AA==</ds:SignatureValue>' +
          '<ds:Object><xades:QualifyingProperties Target="#payload"><xades:UnsignedProperties>' +
          '<xades:UnsignedSignatureProperties><xades:ArchiveTimeStamp/></xades:UnsignedSignatureProperties>' +
          '</xades:UnsignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></doc>',
      )
      const signed = signXml(signer, payload, {
        mode: 'enveloping',
        ids: { signature: 'outer' },
      }).xml
      const result = countersignXadesSignature(counter, signed, {
        target: 'tree',
      })
      expect(result.toString()).not.toContain('URI="#payload-SignatureValue"')
      expect(result.toString()).toContain('URI="#outer-SignatureValue"')
      const ids = listSignatureIds(result).filter((id) => id !== 'payload')
      expect(ids).toHaveLength(2)
      for (const id of ids)
        expect(xmlsecVerifies(result, undefined, id)).toBe('')
    },
  )
})
