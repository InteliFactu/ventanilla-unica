import { describe, expect, it } from 'vitest'

import { buildTestSignatureContext } from '../fixtures/buildTestSignatureContext'
import { renderTestElement } from '../fixtures/renderTestElement'
import { digestBase64 } from '../mappers/digestBase64'
import { buildSigningCertificate } from './buildSigningCertificate'

describe('buildSigningCertificate', () => {
  it('writes v1 with the SHA-256 CertDigest and IssuerSerial', () => {
    const context = buildTestSignatureContext()
    const digest = digestBase64('sha256', context.certificates.signer.raw)
    expect(renderTestElement(buildSigningCertificate(context))).toBe(
      `<xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"></ds:DigestMethod><ds:DigestValue>${digest}</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>CN=VENTANILLA UNICA TEST</ds:X509IssuerName><ds:X509SerialNumber>74565</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate>`,
    )
  })
  it('writes V2 with the CertDigest only', () => {
    const rendered = renderTestElement(
      buildSigningCertificate(
        buildTestSignatureContext({ signingCertificateVersion: 2 }),
      ),
    )
    expect(rendered).toMatch(
      /^<xades:SigningCertificateV2><xades:Cert><xades:CertDigest>/,
    )
    expect(rendered).not.toContain('IssuerSerial')
  })
})
