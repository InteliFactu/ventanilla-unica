import { describe, expect, it } from 'vitest'

import { buildClassicPdf } from '../fixtures/buildClassicPdf'
import { testPdfBodies } from '../fixtures/testPdfBodies'
import { readPdfDocument } from '../parsers/readPdfDocument'
import { selectCertificationLevel } from './selectCertificationLevel'

const certified = (reference: string): Buffer =>
  buildClassicPdf([
    '<< /Type /Catalog /Pages 2 0 R /Perms << /DocMDP 4 0 R >> >>',
    ...testPdfBodies.slice(1),
    `<< /Type /Sig /Reference [${reference}] >>`,
  ])

describe('selectCertificationLevel', () => {
  it('is undefined for a PDF that is not certified', () => {
    expect(
      selectCertificationLevel(readPdfDocument(buildClassicPdf())),
    ).toBeUndefined()
  })

  it('reads /P from the DocMDP reference', () => {
    expect(
      selectCertificationLevel(
        readPdfDocument(
          certified(
            '<< /TransformMethod /DocMDP /TransformParams << /P 1 /V /1.2 >> >>',
          ),
        ),
      ),
    ).toBe(1)
  })

  it('defaults to 2 when /P or the DocMDP reference is missing', () => {
    expect(
      selectCertificationLevel(
        readPdfDocument(certified('<< /TransformMethod /DocMDP >>')),
      ),
    ).toBe(2)
    expect(selectCertificationLevel(readPdfDocument(certified('')))).toBe(2)
  })
})
