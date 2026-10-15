import { describe, expect, it } from 'vitest'

import { facturaePolicy } from '../facturaePolicy'
import { buildTestSignatureContext } from '../fixtures/buildTestSignatureContext'
import { renderTestElement } from '../fixtures/renderTestElement'
import { buildSignedProperties } from './buildSignedProperties'

describe('buildSignedProperties', () => {
  it('writes SigningTime in UTC without milliseconds and a DataObjectFormat', () => {
    const rendered = renderTestElement(
      buildSignedProperties(buildTestSignatureContext()),
    )
    expect(rendered).toMatch(
      /^<xades:SignedProperties Id="S-SignedProperties"><xades:SignedSignatureProperties><xades:SigningTime>2026-09-26T10:00:00Z<\/xades:SigningTime><xades:SigningCertificate>/,
    )
    expect(rendered).toContain(
      '<xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#R"><xades:Description></xades:Description><xades:MimeType>text/xml</xades:MimeType><xades:Encoding></xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties>',
    )
    expect(rendered).not.toContain('SignaturePolicyIdentifier')
  })
  it('adds the policy after SigningCertificate and the Encoding when given', () => {
    const rendered = renderTestElement(
      buildSignedProperties(
        buildTestSignatureContext({ policy: facturaePolicy, encoding: 'enc' }),
      ),
    )
    expect(rendered).toMatch(
      /<\/xades:SigningCertificate><xades:SignaturePolicyIdentifier>/,
    )
    expect(rendered).toContain('<xades:Encoding>enc</xades:Encoding>')
  })
})
