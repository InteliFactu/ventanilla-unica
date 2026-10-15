import { describe, expect, it } from 'vitest'

import { buildClassicPdf } from '../fixtures/buildClassicPdf'
import { readPdfDocument } from '../parsers/readPdfDocument'
import { selectCatalog } from './selectCatalog'
import { selectPages } from './selectPages'

const leaf = '<< /Type /Page >>'
const catalog = '<< /Type /Catalog /Pages 2 0 R >>'

describe('selectPages', () => {
  it('lists the leaves of a nested page tree in document order', () => {
    const doc = readPdfDocument(
      buildClassicPdf([
        catalog,
        '<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 3 >>',
        '<< /Type /Pages /Kids [4 0 R 6 0 R] /Count 2 >>',
        leaf,
        leaf,
        leaf,
      ]),
    )
    expect(
      selectPages(doc, selectCatalog(doc).dict).map((page) => page.ref.num),
    ).toEqual([4, 6, 5])
  })

  it('refuses a page tree node that is not a reference', () => {
    const doc = readPdfDocument(buildClassicPdf(['<< /Pages 7 >>']))
    expect(() => selectPages(doc, selectCatalog(doc).dict)).toThrow(
      'not a reference',
    )
  })

  it.each([
    '<< /Type /Pages /Kids [2 0 R] /Count 1 >>',
    '<< /Type /Pages /Kids [3 0 R 3 0 R] /Count 2 >>',
  ])('refuses a page tree that loops or repeats a node: %s', (pages) => {
    const doc = readPdfDocument(buildClassicPdf([catalog, pages, leaf]))
    expect(() => selectPages(doc, selectCatalog(doc).dict)).toThrow(
      'repeats or loops',
    )
  })
})
