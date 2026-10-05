/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this fixture builds under its own temp dir */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { DgsfpComplaintQuery } from '../types/DgsfpComplaintQuery'

/** A synthetic complaint against an invented insurer, its three PDFs written to a fresh temp dir. */
export const buildComplaintQuery = (): {
  readonly dir: string
  readonly query: DgsfpComplaintQuery
} => {
  const dir = mkdtempSync(join(tmpdir(), 'dgsfp-'))
  const file = (name: string): string => {
    const path = join(dir, name)
    writeFileSync(path, `%PDF-1.4 ${name}`)
    return path
  }
  const query: DgsfpComplaintQuery = {
    entity: 'Aseguradora Ejemplo, S.A.',
    entityNif: 'A00000000',
    entityDetail: 'Póliza 123',
    sacDate: '2026-09-30',
    lawsuits: 'Ninguna',
    email: 'ana@example.es',
    phone: '600000000',
    address: 'Calle Mayor 1',
    province: 'caceres',
    municipality: 'Cáceres',
    town: 'Cáceres',
    postalCode: '10001',
    files: {
      escrito: file('escrito.pdf'),
      sac: file('sac.pdf'),
      anexo: file('anexo.pdf'),
    },
  }
  return { dir, query }
}
