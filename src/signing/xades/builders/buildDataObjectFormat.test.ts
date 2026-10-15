import { describe, expect, it } from 'vitest'

import { buildTestSignatureContext } from '../fixtures/buildTestSignatureContext'
import { renderTestElement } from '../fixtures/renderTestElement'
import { buildDataObjectFormat } from './buildDataObjectFormat'

describe('buildDataObjectFormat', () => {
  it('writes empty Description and Encoding around the MimeType by default', () => {
    expect(
      renderTestElement(buildDataObjectFormat(buildTestSignatureContext())),
    ).toBe(
      '<xades:DataObjectFormat ObjectReference="#R"><xades:Description></xades:Description><xades:MimeType>text/xml</xades:MimeType><xades:Encoding></xades:Encoding></xades:DataObjectFormat>',
    )
  })

  it('puts the ObjectIdentifier before the MimeType and the Encoding after', () => {
    const rendered = renderTestElement(
      buildDataObjectFormat(
        buildTestSignatureContext({
          objectIdentifier: 'urn:oid:1.2.3',
          encoding: 'b64',
        }),
      ),
    )
    expect(rendered).toBe(
      '<xades:DataObjectFormat ObjectReference="#R"><xades:Description></xades:Description><xades:ObjectIdentifier><xades:Identifier Qualifier="OIDAsURN">urn:oid:1.2.3</xades:Identifier><xades:Description></xades:Description></xades:ObjectIdentifier><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>b64</xades:Encoding></xades:DataObjectFormat>',
    )
  })
})
