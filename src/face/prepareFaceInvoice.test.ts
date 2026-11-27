import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../signing/fixtures/buildTestIdentity'
import { hasXmlsec } from '../signing/xades/fixtures/hasXmlsec'
import { xmlsecVerifies } from '../signing/xades/fixtures/xmlsecVerifies'
import { syntheticFacturae322 as invoice } from './fixtures/syntheticFacturae322'
import { prepareFaceInvoice } from './prepareFaceInvoice'

const identity = buildTestIdentity()

describe('offline FACe invoice preparation', () => {
  it('applies the Facturae 3.1 policy with a locally verifiable enveloped signature', () => {
    const signed = prepareFaceInvoice(identity, invoice)
    expect(signed.xml.toString()).toContain(
      'politica_de_firma_formato_facturae',
    )
    expect(signed.xml.toString()).toContain('enveloped-signature')
  })

  it.skipIf(!hasXmlsec)('verifies the signed invoice with xmlsec1', () => {
    const signed = prepareFaceInvoice(identity, invoice)
    expect(() => xmlsecVerifies(signed.xml)).not.toThrow()
  })

  it('accepts a default namespace on the root when child namespaces are reset', () => {
    const unprefixed = invoice
      .toString()
      .replaceAll('fe:Facturae', 'Facturae')
      .replace('xmlns:fe=', 'xmlns=')
      .replace('<FileHeader>', '<FileHeader xmlns="">')
      .replace('<Parties/>', '<Parties xmlns=""/>')
      .replace('<Invoices>', '<Invoices xmlns="">')
    expect(
      prepareFaceInvoice(identity, Buffer.from(unprefixed)).xml.toString(),
    ).toContain('enveloped-signature')
  })

  it.each([
    '<Facturae/>',
    invoice.toString().replace('3.2.2</', '3.2.1</'),
    invoice.toString().replace('<Invoice/>', ''),
    invoice.toString().replace('<Invoice/>', '<Invoice/><Invoice/>'),
    invoice.toString().replace('<Parties/>', '<Parties xmlns="urn:other"/>'),
  ])('rejects an invoice outside the Facturae 3.2.2 input contract', (xml) => {
    expect(() => prepareFaceInvoice(identity, Buffer.from(xml))).toThrow(
      /Facturae 3\.2\.2/u,
    )
  })

  it('rejects a pre-existing XML signature', () => {
    const signed = prepareFaceInvoice(identity, invoice)
    expect(() => prepareFaceInvoice(identity, signed.xml)).toThrow(/signature/u)
  })
})
