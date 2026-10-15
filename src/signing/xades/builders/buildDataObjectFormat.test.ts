import { describe, expect, it } from 'vitest'

import { buildTestSignatureContext } from '../fixtures/buildTestSignatureContext'
import { renderTestElement } from '../fixtures/renderTestElement'
import { buildDataObjectFormat } from './buildDataObjectFormat'

describe('buildDataObjectFormat', () => {
  it('writes the MimeType alone by default', () => {
    expect(
      renderTestElement(buildDataObjectFormat(buildTestSignatureContext())),
    ).toBe(
      '<xades:DataObjectFormat ObjectReference="#R"><xades:MimeType>text/xml</xades:MimeType></xades:DataObjectFormat>',
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
      '<xades:DataObjectFormat ObjectReference="#R"><xades:ObjectIdentifier><xades:Identifier Qualifier="OIDAsURN">urn:oid:1.2.3</xades:Identifier></xades:ObjectIdentifier><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>b64</xades:Encoding></xades:DataObjectFormat>',
    )
  })
})
