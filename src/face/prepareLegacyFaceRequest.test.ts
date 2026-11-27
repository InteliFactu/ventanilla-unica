import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../signing/fixtures/buildTestIdentity'
import { hasXmlsec } from '../signing/xades/fixtures/hasXmlsec'
import { xmlsecVerifies } from '../signing/xades/fixtures/xmlsecVerifies'
import { syntheticFacturae322 as invoice } from './fixtures/syntheticFacturae322'
import { prepareLegacyFaceRequest } from './prepareLegacyFaceRequest'

const identity = buildTestIdentity()
const fields = { filename: 'invoice.xsig', email: 'holder@example.test' }

describe('offline legacy FACe SOAP', () => {
  it('embeds the complete signed invoice in the RPC-literal request', () => {
    const result = prepareLegacyFaceRequest(identity, invoice, fields)
    expect(result.soap.toString()).toContain(
      'xmlns:face="https://webservice.face.gob.es"',
    )
    expect(result.soap.toString()).toContain(
      '<request><correo>holder@example.test</correo><factura>',
    )
    expect(result.soap.toString()).toContain(
      `<factura>${result.invoice.toString('base64')}</factura>`,
    )
    expect(result.soap.toString()).toContain(
      '<nombre>invoice.xsig</nombre><mime>text/xml</mime></factura></request></face:enviarFactura>',
    )
  })

  it.skipIf(!hasXmlsec)(
    'signs the SOAP Body and detects a change to the recipient',
    () => {
      const result = prepareLegacyFaceRequest(identity, invoice, fields)
      const cwd = mkdtempSync(join(tmpdir(), 'ventanilla-unica-face-'))
      const verify = (soap: Buffer): string => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- based on this test's temporary directory
        writeFileSync(join(cwd, 'request.xml'), soap)
        const supportsLaxKeySearch = execFileSync(
          'xmlsec1',
          ['--help-verify'],
          { encoding: 'utf8' },
        ).includes('--lax-key-search')
        return execFileSync(
          'xmlsec1',
          [
            '--verify',
            ...(supportsLaxKeySearch ? ['--lax-key-search'] : []),
            '--pubkey-cert-pem',
            'test.pem',
            '--id-attr:Id',
            'http://schemas.xmlsoap.org/soap/envelope/:Body',
            'request.xml',
          ],
          { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
        )
      }
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- based on this test's temporary directory
      writeFileSync(join(cwd, 'test.pem'), identity.cert)
      expect(() => xmlsecVerifies(result.invoice)).not.toThrow()
      expect(() => verify(result.soap)).not.toThrow()
      expect(() =>
        verify(
          Buffer.from(
            result.soap.toString().replace(fields.email, 'other@example.test'),
          ),
        ),
      ).toThrow()
    },
  )

  it.each([
    { ...fields, filename: '../invoice.xsig' },
    { ...fields, filename: 'invoice.xml' },
    { ...fields, filename: 'invoice.xsig\n' },
    { ...fields, email: 'sales@example.test\nops@example.test' },
    { ...fields, email: 'sales@example.test<script>' },
    { ...fields, email: 'sales\0@example.test' },
  ])('rejects malformed delivery fields', (invalid) => {
    expect(() => prepareLegacyFaceRequest(identity, invoice, invalid)).toThrow(
      /filename|email/u,
    )
  })

  it('rejects an identity with a mismatched private key', () => {
    const other = buildTestIdentity('SECOND SYNTHETIC CERTIFICATE')
    expect(() =>
      prepareLegacyFaceRequest(
        { ...identity, key: other.key },
        invoice,
        fields,
      ),
    ).toThrow(/private key/u)
  })

  it('rejects a non-RSA identity for the legacy SOAP profile', () => {
    const ec = buildTestIdentity('SYNTHETIC P-256 CERTIFICATE', undefined, 'ec')
    expect(() => prepareLegacyFaceRequest(ec, invoice, fields)).toThrow(/RSA/u)
  })
})
