import { describe, expect, it } from 'vitest'

import { buildClassicPdf } from '../fixtures/buildClassicPdf'
import { pdfRefTo } from '../objects/pdfRefTo'
import { serializePdfValue } from '../objects/serializePdfValue'
import { readPdfDocument } from '../parsers/readPdfDocument'
import { selectCatalog } from '../selectors/selectCatalog'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import { extendAcroForm } from './extendAcroForm'
import { withSignatureField } from './withSignatureField'

const addField =
  (doc: PdfDocument) =>
  (form: PdfDict): PdfDict =>
    withSignatureField(doc, form, pdfRefTo(9))

const open = (catalog: string, ...rest: string[]) => {
  const doc = readPdfDocument(buildClassicPdf([catalog, ...rest]))
  return { doc, catalog: selectCatalog(doc).dict }
}

describe('extendAcroForm', () => {
  it('creates a new AcroForm object when there is none', () => {
    const { doc, catalog } = open('<< /Type /Catalog >>')
    const allocator = { next: 20 }
    const change = extendAcroForm(doc, catalog, addField(doc), allocator)
    expect(change.dict?.entries).toContainEqual(['AcroForm', pdfRefTo(20)])
    expect(change.objects[0]?.bytes.toString('latin1')).toContain(
      '/Fields [9 0 R] /SigFlags 3',
    )
  })

  it('extends an inline AcroForm inside the catalog', () => {
    const { doc, catalog } = open('<< /AcroForm << /Fields [4 0 R] >> >>')
    const change = extendAcroForm(doc, catalog, addField(doc), { next: 20 })
    expect(change.dict && serializePdfValue(change.dict)).toBe(
      '<< /AcroForm << /Fields [4 0 R 9 0 R] /SigFlags 3 >> >>',
    )
    expect(change.objects).toEqual([])
  })

  it('rewrites an indirect AcroForm and leaves the catalog alone', () => {
    const { doc, catalog } = open(
      '<< /AcroForm 2 0 R >>',
      '<< /Fields [] /DA (x) >>',
    )
    const change = extendAcroForm(doc, catalog, addField(doc), { next: 20 })
    expect(change.dict).toBeUndefined()
    expect(change.objects[0]?.bytes.toString('latin1')).toBe(
      '2 0 obj\n<< /Fields [9 0 R] /DA (x) /SigFlags 3 >>\nendobj\n',
    )
  })

  it('refuses an indirect AcroForm that is not a dictionary', () => {
    const { doc, catalog } = open('<< /AcroForm 2 0 R >>', '[1]')
    expect(() =>
      extendAcroForm(doc, catalog, addField(doc), { next: 20 }),
    ).toThrow(/not a dictionary/)
  })
})
