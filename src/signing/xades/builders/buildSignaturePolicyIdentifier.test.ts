import { describe, expect, it } from 'vitest'

import { agePolicy } from '../agePolicy'
import { facturaePolicy } from '../facturaePolicy'
import { renderTestElement } from '../fixtures/renderTestElement'
import { buildSignaturePolicyIdentifier } from './buildSignaturePolicyIdentifier'

const prefixes = { ds: 'ds', xades: 'xa' }

describe('buildSignaturePolicyIdentifier', () => {
  it('names the policy, its description and its hash', () => {
    expect(
      renderTestElement(
        buildSignaturePolicyIdentifier(prefixes, facturaePolicy),
      ),
    ).toBe(
      `<xa:SignaturePolicyIdentifier><xa:SignaturePolicyId><xa:SigPolicyId><xa:Identifier>${facturaePolicy.identifier}</xa:Identifier><xa:Description>Política de Firma FacturaE v3.1</xa:Description></xa:SigPolicyId><xa:SigPolicyHash><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></ds:DigestMethod><ds:DigestValue>Ohixl6upD6av8N7pEvDABhEL6hM=</ds:DigestValue></xa:SigPolicyHash></xa:SignaturePolicyId></xa:SignaturePolicyIdentifier>`,
    )
  })
  it('omits an absent description', () => {
    expect(
      renderTestElement(
        buildSignaturePolicyIdentifier(prefixes, {
          identifier: 'urn:p',
          digestAlgorithm: 'a',
          digestValue: 'v',
        }),
      ),
    ).not.toContain('Description')
  })
  it('appends the SPURI qualifier after the hash', () => {
    const rendered = renderTestElement(
      buildSignaturePolicyIdentifier(prefixes, agePolicy),
    )
    expect(rendered).toContain(
      '</xa:SigPolicyHash><xa:SigPolicyQualifiers><xa:SigPolicyQualifier><xa:SPURI>https://sede.administracion.gob.es/politica_de_firma_anexo_1.pdf</xa:SPURI></xa:SigPolicyQualifier></xa:SigPolicyQualifiers></xa:SignaturePolicyId>',
    )
    expect(rendered).toContain(
      '<xa:Identifier>urn:oid:2.16.724.1.3.1.1.2.1.9</xa:Identifier>',
    )
  })
})
