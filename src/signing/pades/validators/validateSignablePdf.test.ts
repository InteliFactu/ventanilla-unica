import { describe, expect, it } from 'vitest'

import { buildClassicPdf } from '../fixtures/buildClassicPdf'
import { testPdfBodies } from '../fixtures/testPdfBodies'
import { readPdfDocument } from '../parsers/readPdfDocument'
import { validateSignablePdf } from './validateSignablePdf'

const certifiedWith = (level: number): Buffer =>
  buildClassicPdf([
    '<< /Type /Catalog /Pages 2 0 R /Perms << /DocMDP 4 0 R >> >>',
    ...testPdfBodies.slice(1),
    `<< /Type /Sig /Reference [<< /TransformMethod /DocMDP /TransformParams << /P ${String(level)} >> >>] >>`,
  ])

describe('validateSignablePdf', () => {
  it('refuses a PDF certified with no changes allowed', () => {
    expect(() => {
      validateSignablePdf(readPdfDocument(certifiedWith(1)))
    }).toThrow('DocMDP P=1')
  })

  it('accepts a PDF certified for form filling and signing', () => {
    expect(() => {
      validateSignablePdf(readPdfDocument(certifiedWith(2)))
    }).not.toThrow()
  })
})
