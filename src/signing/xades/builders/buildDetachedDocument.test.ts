import { describe, expect, it } from 'vitest'

import { buildTestSignatureContext } from '../fixtures/buildTestSignatureContext'
import { renderTestElement } from '../fixtures/renderTestElement'
import { xadesUris } from '../xadesUris'
import { buildDetachedDocument } from './buildDetachedDocument'
import { buildElement } from './buildElement'

describe('buildDetachedDocument', () => {
  it('carries non-XML content in base64 with its Encoding', () => {
    const { root } = buildDetachedDocument(
      buildTestSignatureContext({
        mimeType: 'application/pdf',
        encoding: xadesUris.base64,
      }),
      { bytes: Buffer.from([1, 2, 3]), document: undefined },
      buildElement('ds:Signature', {}),
    )
    expect(renderTestElement(root)).toBe(
      `<AFIRMA Id="AFIRMA-Root"><CONTENT Encoding="${xadesUris.base64}" Id="CONTENT" MimeType="application/pdf">AQID</CONTENT><ds:Signature></ds:Signature></AFIRMA>`,
    )
  })
})
