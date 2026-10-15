import { describe, expect, it } from 'vitest'

import { buildClassicPdf } from '../fixtures/buildClassicPdf'
import { readPdfDocument } from '../parsers/readPdfDocument'
import type { SignatureRequest } from '../types/SignatureRequest'
import { planSignatureObjects } from './planSignatureObjects'

describe('planSignatureObjects', () => {
  const doc = readPdfDocument(buildClassicPdf())
  const request: SignatureRequest = {
    commonName: 'ANA',
    date: new Date(0),
    stampLines: undefined,
    page: 1,
    rect: [36, 36, 336, 86],
    field: undefined,
  }

  it('writes signature, widget, page, AcroForm and catalog for an invisible signature', () => {
    const objects = planSignatureObjects(doc, request)
    expect(objects.map((object) => object.num)).toEqual([4, 5, 3, 6, 1])
    expect(objects[1]?.bytes.toString('latin1')).toContain('/T (Signature5)')
  })

  it('adds the font and appearance of a visible stamp', () => {
    const objects = planSignatureObjects(doc, {
      ...request,
      stampLines: ['x'],
    })
    expect(objects.map((object) => object.num)).toEqual([4, 5, 6, 7, 3, 8, 1])
  })

  it('does not rewrite catalog or page when AcroForm and Annots are indirect', () => {
    const indirect = readPdfDocument(
      buildClassicPdf([
        '<< /Type /Catalog /Pages 2 0 R /AcroForm 4 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /Annots 5 0 R >>',
        '<< /Fields [] >>',
        '[]',
      ]),
    )
    expect(
      planSignatureObjects(indirect, request).map((object) => object.num),
    ).toEqual([6, 7, 5, 4])
  })

  it('puts the field on the requested page, counting from the end when negative', () => {
    const twoPages = readPdfDocument(
      buildClassicPdf([
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
        '<< /Type /Page /Parent 2 0 R >>',
        '<< /Type /Page /Parent 2 0 R >>',
      ]),
    )
    const objects = planSignatureObjects(twoPages, { ...request, page: -1 })
    expect(objects.map((object) => object.num)).toContain(4)
    expect(objects.map((object) => object.num)).not.toContain(3)
    expect(() =>
      planSignatureObjects(twoPages, { ...request, page: 3 }),
    ).toThrow('page 3 does not exist (the PDF has 2)')
  })

  it('fills an existing empty signature field and draws in its rectangle', () => {
    const withField = readPdfDocument(
      buildClassicPdf([
        '<< /Type /Catalog /Pages 2 0 R /AcroForm << /Fields [4 0 R] >> >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /Annots [4 0 R] >>',
        '<< /FT /Sig /T (Firma1) /Type /Annot /Subtype /Widget /Rect [100 100 300 160] /P 3 0 R >>',
      ]),
    )
    const objects = planSignatureObjects(withField, {
      ...request,
      stampLines: ['x'],
      field: 'Firma1',
    })
    expect(objects.map((object) => object.num)).toEqual([5, 4, 6, 7, 1])
    const field = objects[1]?.bytes.toString('latin1') ?? ''
    expect(field).toContain('/V 5 0 R')
    expect(field).toContain('/AP << /N 7 0 R >>')
    expect(objects[3]?.bytes.toString('latin1')).toContain('/BBox [0 0 200 60]')
    expect(() =>
      planSignatureObjects(withField, { ...request, field: 'Otra' }),
    ).toThrow('no signature field named Otra')
  })
})
