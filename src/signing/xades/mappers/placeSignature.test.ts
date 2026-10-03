import { describe, expect, it } from 'vitest'

import { parseXmlDocument } from '../../xml/parsers/parseXmlDocument'
import { buildElement } from '../builders/buildElement'
import { placeSignature } from './placeSignature'

const signature = buildElement('ds:Signature', {})

describe('placeSignature', () => {
  it('appends the signature to the root when enveloped', () => {
    const document = parseXmlDocument('<a><b/></a>')
    const placed = placeSignature(
      'enveloped',
      { bytes: Buffer.alloc(0), document },
      signature,
    )
    expect(placed).toBe(document)
    expect(placed.root.children.at(-1)).toBe(signature)
  })
  it('appends the signature to the signed node when one is named', () => {
    const document = parseXmlDocument('<a><b id="n"/></a>')
    const placed = placeSignature(
      'enveloped',
      { bytes: Buffer.alloc(0), document, signedNodeId: 'n' },
      signature,
    )
    expect(placed.root.children[0]).toMatchObject({ children: [signature] })
  })
  it('makes the signature the root otherwise', () => {
    const content = { bytes: Buffer.alloc(0), document: undefined }
    expect(placeSignature('detached', content, signature).root).toBe(signature)
    expect(placeSignature('enveloping', content, signature).root).toBe(
      signature,
    )
  })
  it('refuses enveloped signing of non-XML content', () => {
    expect(() =>
      placeSignature(
        'enveloped',
        { bytes: Buffer.alloc(0), document: undefined },
        signature,
      ),
    ).toThrow('needs XML content')
  })
})
