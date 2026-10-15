import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { RegFilingFixture } from './RegFilingFixture'

/** A filing query with one synthetic PDF on disk, and the temporary directory holding it. */
export const buildRegFilingQuery = (): RegFilingFixture => {
  const dir = mkdtempSync(join(tmpdir(), 'reg-'))
  const pdf = join(dir, 'escrito.pdf')
  // A fixed name under a fresh temporary directory.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(pdf, '%PDF-1.4\n')
  return {
    dir,
    query: {
      organism: 'L01100000',
      subject: 'Escrito',
      exposes: 'Que expone',
      request: 'Que solicita',
      documents: [pdf],
      viaType: 'calle',
      via: 'Mayor 1',
      zipCode: '10001',
      province: 'caceres',
      town: 'prueba',
      email: '',
      phone: '',
    },
  }
}
