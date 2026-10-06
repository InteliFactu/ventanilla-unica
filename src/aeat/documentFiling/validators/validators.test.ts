/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readFilingDocuments } from './readFilingDocuments'
import { validateDocumentFilingOptions } from './validateDocumentFilingOptions'

const valid = {
  csv: 'abcdefgh12345678',
  como: 'representante',
  asunto: 'Alegaciones',
  telefono: '600 000 000',
  documentos: 'a.pdf,b.pdf',
}

describe('documentFiling validators', () => {
  it('builds the query, defaulting each type to 200', () => {
    expect(validateDocumentFilingOptions(valid)).toEqual({
      csv: 'ABCDEFGH12345678',
      role: 'R',
      subject: 'Alegaciones',
      phone: '600000000',
      email: undefined,
      files: [
        { path: 'a.pdf', type: '200' },
        { path: 'b.pdf', type: '200' },
      ],
    })
    expect(
      validateDocumentFilingOptions({
        ...valid,
        como: 'interesado',
        tipos: '203,227',
      }).files[1]?.type,
    ).toBe('227')
  })

  it.each([
    [{ csv: 'short' }, '--csv'],
    [{ como: 'yo' }, '--como'],
    [{ asunto: ' ' }, '--asunto'],
    [{ telefono: 'abc' }, '--telefono'],
    [{ documentos: '' }, '--documentos'],
    [{ tipos: '203' }, 'one type code per document'],
    [{ tipos: '203,999' }, 'unknown document type 999'],
  ])('refuses %j', (patch, message) => {
    expect(() => validateDocumentFilingOptions({ ...valid, ...patch })).toThrow(
      message,
    )
  })

  it('reads PDFs and refuses anything else', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'aportar-'))
    const pdf = join(dir, 'escrito.pdf')
    const text = join(dir, 'nota.txt')
    await writeFile(pdf, '%PDF-1.4 x')
    await writeFile(text, 'hello')
    const [document] = await readFilingDocuments([{ path: pdf, type: '203' }])
    expect(document).toMatchObject({ name: 'escrito.pdf', type: '203' })
    await expect(
      readFilingDocuments([{ path: text, type: '200' }]),
    ).rejects.toThrow('is not a PDF')
  })
})
