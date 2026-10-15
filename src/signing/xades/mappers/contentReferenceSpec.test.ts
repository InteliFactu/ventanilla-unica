import { describe, expect, it } from 'vitest'

import { parseXmlDocument } from '../../xml/parsers/parseXmlDocument'
import { buildTestSignatureContext } from '../fixtures/buildTestSignatureContext'
import { xadesUris } from '../xadesUris'
import { contentReferenceSpec } from './contentReferenceSpec'

const context = buildTestSignatureContext()
const bytes = Buffer.from('<a/>')
const xml = { bytes, document: parseXmlDocument(bytes) }
const binary = { bytes, document: undefined }

describe('contentReferenceSpec', () => {
  it('signs the whole document minus the signature when enveloped', () => {
    expect(contentReferenceSpec('enveloped', context, xml, undefined)).toEqual({
      id: 'R',
      uri: '',
      transforms: [
        xadesUris.envelopedSignature,
        xadesUris.c14n,
        xadesUris.xpath,
      ],
      target: { kind: 'enveloped' },
    })
  })
  it('keeps the enveloped transform alone when the context drops C14N', () => {
    expect(
      contentReferenceSpec(
        'enveloped',
        buildTestSignatureContext({ contentC14nTransform: false }),
        xml,
        undefined,
      ).transforms,
    ).toEqual([xadesUris.envelopedSignature])
  })
  it('signs one node by id when the context names it', () => {
    expect(
      contentReferenceSpec(
        'enveloped',
        context,
        { ...xml, signedNodeId: 'root' },
        undefined,
      ),
    ).toMatchObject({
      uri: '#root',
      target: { kind: 'enveloped', node: 'root' },
    })
  })
  it('points at the typed object when enveloping, through C14N or base64', () => {
    expect(
      contentReferenceSpec('enveloping', context, xml, undefined),
    ).toMatchObject({
      uri: '#S-Object',
      type: xadesUris.objectType,
      transforms: [xadesUris.c14n],
      target: { id: 'S-Object' },
    })
    expect(
      contentReferenceSpec('enveloping', context, binary, undefined),
    ).toMatchObject({
      uri: '#S-Object',
      transforms: [xadesUris.base64],
      target: { kind: 'bytes', data: bytes },
    })
  })
  it('points at the CONTENT node when internally detached', () => {
    expect(
      contentReferenceSpec('internally-detached', context, xml, undefined),
    ).toEqual({
      id: 'R',
      uri: '#CONTENT',
      transforms: [xadesUris.c14n],
      target: { kind: 'id', id: 'CONTENT' },
    })
    expect(
      contentReferenceSpec('internally-detached', context, binary, undefined),
    ).toMatchObject({
      transforms: [xadesUris.base64],
      target: { kind: 'bytes', data: bytes },
    })
  })
  it('digests the raw bytes under the given URI when detached', () => {
    expect(
      contentReferenceSpec('detached', context, binary, 'a.xml'),
    ).toMatchObject({ uri: 'a.xml', target: { kind: 'bytes', data: bytes } })
    expect(() =>
      contentReferenceSpec('detached', context, binary, undefined),
    ).toThrow('needs the content URI')
  })
})
