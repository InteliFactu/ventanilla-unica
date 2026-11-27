import { X509Certificate } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { prepareFaceRequest } from '../index'
import { buildTestIdentity } from '../signing/fixtures/buildTestIdentity'
import { hasXmlsec } from '../signing/xades/fixtures/hasXmlsec'
import { xmlsecVerifies } from '../signing/xades/fixtures/xmlsecVerifies'
import { syntheticFacturae322 as invoice } from './fixtures/syntheticFacturae322'
import { verifyFaceSoapWithXmlsec } from './fixtures/verifyFaceSoapWithXmlsec'

const identity = buildTestIdentity('SYNTHETIC FACE SUPPLIER')
const delivery = {
  filename: 'supplier-invoice.xsig',
  email: 'supplier@example.test',
}

describe('FACe supplier SOAP v1 preparation', () => {
  it('packs the signed invoice in the supplier v1 RPC-literal shape', () => {
    const prepared = prepareFaceRequest(identity, invoice, delivery)
    const soap = prepared.soap.toString()
    expect(prepared.soapAction).toBe(
      'https://ws.face.gob.es/proveedores/v1/factura#enviarFactura',
    )
    expect(soap).toContain(
      'xmlns:face="https://ws.face.gob.es/proveedores/v1/factura"',
    )
    expect(soap).toContain(
      `<request><correo>${delivery.email}</correo><factura><factura>${prepared.invoice.toString('base64')}</factura><nombre>${delivery.filename}</nombre></factura></request>`,
    )
  })

  it('references the binary certificate and uses the documented body digest', () => {
    const soap = prepareFaceRequest(identity, invoice, delivery).soap.toString()
    const token =
      /<wsse:BinarySecurityToken ([^>]+)>([^<]+)<\/wsse:BinarySecurityToken>/u.exec(
        soap,
      )
    const tokenId = /(?:^| )wsu:Id="([^"]+)"/u.exec(token?.[1] ?? '')?.[1]
    const cert = new X509Certificate(identity.cert).raw.toString('base64')
    expect(token?.[2]).toBe(cert)
    expect(soap).toContain(`<wsse:Reference URI="#${tokenId ?? ''}"`)
    expect(soap).toContain('soap:mustUnderstand="1"')
    expect(soap).toContain(
      '<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">',
    )
    expect(soap).toContain(
      '<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256">',
    )
  })

  it.skipIf(!hasXmlsec)(
    'verifies the invoice and rejects a modified signed SOAP body',
    () => {
      const prepared = prepareFaceRequest(identity, invoice, delivery)
      expect(() => xmlsecVerifies(prepared.invoice)).not.toThrow()
      expect(() => {
        verifyFaceSoapWithXmlsec(prepared.soap, identity.cert)
      }).not.toThrow()
      const modified = Buffer.from(
        prepared.soap.toString().replace(delivery.filename, 'different.xsig'),
      )
      expect(() => {
        verifyFaceSoapWithXmlsec(modified, identity.cert)
      }).toThrow()
    },
  )
})
