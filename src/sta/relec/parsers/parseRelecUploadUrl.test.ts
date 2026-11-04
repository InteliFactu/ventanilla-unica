import { describe, expect, it } from 'vitest'

import { parseRelecUploadUrl } from './parseRelecUploadUrl'

const origin = 'https://sede.caceres.es'
const slot = '6261100000000000000001'
const html = `openUploader('${slot}','xml','S','NEW','1','false','true','','true');
openUploader('${slot}','pdf','S','9','50','true','false','7','false')`

describe('parseRelecUploadUrl', () => {
  it('preserves large DocReq ids and the holder row uploader constraints', () => {
    expect(parseRelecUploadUrl(html, origin, slot, '9')).toBe(
      `${origin}/sta/pages/relec/documentSignSend.jsp?tipoDocumento=6261100000000000000001&firma=S&extensions=pdf&personDBOID=9&maxSize=50&checkPdf=true&reusable=false&allowMultiple=false&indice=7`,
    )
  })

  it('refuses a template row when no holder row is offered', () => {
    expect(() => parseRelecUploadUrl(html, origin, slot, '10')).toThrow(
      'no signed uploader',
    )
  })

  it('refuses unsigned uploads', () => {
    expect(() =>
      parseRelecUploadUrl(html.replaceAll("'S'", "'N'"), origin, slot, '9'),
    ).toThrow('no signed uploader')
  })
})
