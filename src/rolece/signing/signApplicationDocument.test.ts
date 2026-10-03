import { verify } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { parseCertificateChain } from '../../signing/xades/parsers/parseCertificateChain'
import { canonicalizeSubtree } from '../../signing/xml/mappers/canonicalizeSubtree'
import { parseXmlDocument } from '../../signing/xml/parsers/parseXmlDocument'
import { selectElementPath } from '../../signing/xml/selectors/selectElementPath'
import { signingFixtures } from '../fixtures/signingFixtures'
import { signApplicationDocument } from './signApplicationDocument'

const { identity, document } = signingFixtures

describe('signApplicationDocument', () => {
  it('signs node root enveloped and keeps the document in ISO-8859-1', () => {
    const { xml, signer } = signApplicationDocument(identity, document)
    expect(signer).toBe('CN=00000000T TEST (R: B00000000)')
    const text = xml.toString('latin1')
    expect(
      text.startsWith(
        '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>',
      ),
    ).toBe(true)
    expect(text).toContain('Secretaría General')
    expect(text).toContain('URI="#root"')
    expect(text).toContain('<ds:RSAKeyValue>')
    const parsed = parseXmlDocument(xml)
    expect(parsed.root.children.at(-1)).toMatchObject({ name: 'ds:Signature' })
    const signedInfo =
      selectElementPath(
        parsed.root,
        (element) => element.name === 'ds:SignedInfo',
      ) ?? []
    const value = /<ds:SignatureValue[^>]*>([^<]+)</.exec(text)?.[1] ?? ''
    expect(
      verify(
        'sha256',
        Buffer.from(
          canonicalizeSubtree(signedInfo, {
            withComments: false,
            exclusive: false,
          }),
        ),
        parseCertificateChain(identity.cert).signer.publicKey,
        Buffer.from(value, 'base64'),
      ),
    ).toBe(true)
  })
})
