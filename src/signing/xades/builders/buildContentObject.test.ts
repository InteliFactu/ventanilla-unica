import { describe, expect, it } from 'vitest'

import { parseXmlDocument } from '../../xml/parsers/parseXmlDocument'
import { buildTestSignatureContext } from '../fixtures/buildTestSignatureContext'
import { renderTestElement } from '../fixtures/renderTestElement'
import { buildContentObject } from './buildContentObject'

describe('buildContentObject', () => {
  it('wraps the XML root element under its MimeType', () => {
    const document = parseXmlDocument('<!--c--><a>x</a>')
    expect(
      renderTestElement(
        buildContentObject(buildTestSignatureContext(), {
          bytes: Buffer.alloc(0),
          document,
        }),
      ),
    ).toBe('<ds:Object Id="S-Object" MimeType="text/xml"><a>x</a></ds:Object>')
  })
  it('carries other bytes in base64', () => {
    expect(
      renderTestElement(
        buildContentObject(
          buildTestSignatureContext({ mimeType: 'application/pdf' }),
          { bytes: Buffer.from('%PDF'), document: undefined },
        ),
      ),
    ).toBe(
      '<ds:Object Encoding="http://www.w3.org/2000/09/xmldsig#base64" Id="S-Object" MimeType="application/pdf">JVBERg==</ds:Object>',
    )
  })
})
