/* eslint-disable security/detect-non-literal-fs-filename -- every path is a fixture or one this test built under its own temp dir */
import { execFileSync } from 'node:child_process'
import { createHash, verify } from 'node:crypto'
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { canonicalizeSubtree } from '../xml/mappers/canonicalizeSubtree'
import { parseXmlDocument } from '../xml/parsers/parseXmlDocument'
import { selectElementPath } from '../xml/selectors/selectElementPath'
import type { XmlElement } from '../xml/types/XmlElement'
import { facturaePolicy } from './facturaePolicy'
import { parseCertificateChain } from './parsers/parseCertificateChain'
import { signXml } from './signXml'
import type { XadesMode } from './types/XadesMode'

const identity = buildTestIdentity()
const invoice = Buffer.from(
  '<?xml version="1.0" encoding="UTF-8"?>\n<fe:Facturae xmlns:fe="http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml"><FileHeader><SchemaVersion>3.2.2</SchemaVersion></FileHeader></fe:Facturae>\n',
)
const named = (name: string) => (element: XmlElement) => element.name === name

const signedInfoVerifies = (xml: Buffer): boolean => {
  const path = selectElementPath(
    parseXmlDocument(xml).root,
    named('ds:SignedInfo'),
  )
  const value = /<ds:SignatureValue[^>]*>([^<]+)</.exec(xml.toString())?.[1]
  const canonical = canonicalizeSubtree(path ?? [], {
    withComments: false,
    exclusive: false,
  })
  return verify(
    'sha256',
    Buffer.from(canonical),
    parseCertificateChain(identity.cert).signer.publicKey,
    Buffer.from(value ?? '', 'base64'),
  )
}

const xmlsecVerifies = (xml: Buffer, detached?: Buffer): string => {
  const dir = mkdtempSync(join(tmpdir(), 'ventanilla-unica-xades-'))
  if (detached) writeFileSync(join(dir, 'invoice.xml'), detached)
  writeFileSync(join(dir, 'signed.xml'), xml)
  return execFileSync(
    'xmlsec1',
    [
      '--verify',
      '--insecure',
      '--enabled-reference-uris',
      'empty,same-doc,local,remote',
      '--id-attr:Id',
      'http://uri.etsi.org/01903/v1.3.2#:SignedProperties',
      '--id-attr:Id',
      'http://www.w3.org/2000/09/xmldsig#:KeyInfo',
      '--id-attr:Id',
      'http://www.w3.org/2000/09/xmldsig#:Object',
      'signed.xml',
    ],
    { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )
}

const hasXmlsec = ['/opt/homebrew/bin/xmlsec1', '/usr/bin/xmlsec1'].some(
  (path) => existsSync(path),
)

describe('signXml', () => {
  it.each(['enveloped', 'enveloping', 'detached'] as const)(
    'signs %s with a SignatureValue the certificate verifies',
    (mode: XadesMode) => {
      const result = signXml(identity, invoice, {
        mode,
        policy: facturaePolicy,
        detachedUri: 'invoice.xml',
        ids: { signature: 'Sig' },
        signingTime: new Date('2026-09-26T10:00:00Z'),
      })
      expect(result).toMatchObject({
        mode,
        signatureId: 'Sig',
        signer: 'CN=VENTANILLA UNICA TEST',
      })
      expect(signedInfoVerifies(result.xml)).toBe(true)
      const root = parseXmlDocument(result.xml).root
      expect(root.name).toBe(
        mode === 'enveloped' ? 'fe:Facturae' : 'ds:Signature',
      )
    },
  )

  it('wraps non-XML content in base64 when enveloping', () => {
    const result = signXml(identity, Buffer.from([0, 1, 2]), {
      mode: 'enveloping',
    })
    expect(result.xml.toString()).toContain(
      'Encoding="http://www.w3.org/2000/09/xmldsig#base64"',
    )
    expect(signedInfoVerifies(result.xml)).toBe(true)
  })

  it('signs one node by id, AutoFirma nodeToSign style, inside that node', () => {
    const application = Buffer.from(
      '<?xml version="1.0" encoding="ISO-8859-1"?>\n<?xml-stylesheet href="s.xsl"?><r:A xmlns:r="urn:r" id="root"><n>Secretar\u00eda</n></r:A>',
      'latin1',
    )
    const { xml } = signXml(identity, application, {
      mode: 'enveloped',
      signedNodeId: 'root',
    })
    const text = xml.toString()
    expect(text).toContain('URI="#root"')
    expect(parseXmlDocument(xml).root.children.at(-1)).toMatchObject({
      name: 'ds:Signature',
    })
    expect(signedInfoVerifies(xml)).toBe(true)
    const digest = /URI="#root">[\s\S]*?<ds:DigestValue>([^<]+)</.exec(text)
    expect(digest?.[1]).toBe(
      createHash('sha256')
        .update('<r:A xmlns:r="urn:r" id="root"><n>Secretar\u00eda</n></r:A>')
        .digest('base64'),
    )
  })

  it('refuses a key that does not belong to the certificate', () => {
    const other = buildTestIdentity()
    expect(() =>
      signXml({ cert: identity.cert, key: other.key }, invoice, {
        mode: 'enveloped',
      }),
    ).toThrow('does not match the signing certificate')
  })

  it.skipIf(!hasXmlsec).each(['enveloped', 'enveloping', 'detached'] as const)(
    'passes xmlsec1 --verify when %s',
    (mode: XadesMode) => {
      const result = signXml(identity, invoice, {
        mode,
        policy: facturaePolicy,
        detachedUri: 'invoice.xml',
        keyInfo: { keyValue: true },
        signingCertificateVersion: 2,
      })
      expect(xmlsecVerifies(result.xml, invoice)).toBe('')
    },
  )

  it.skipIf(!hasXmlsec).each(['enveloped', 'enveloping'] as const)(
    'fails xmlsec1 --verify once the %s content changes',
    (mode: XadesMode) => {
      const { xml } = signXml(identity, invoice, { mode })
      const tampered = Buffer.from(xml.toString().replace('3.2.2', '3.2.1'))
      expect(() => xmlsecVerifies(tampered)).toThrow()
    },
  )
})
