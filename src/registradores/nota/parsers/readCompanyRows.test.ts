import { describe, expect, it } from 'vitest'

import { registradoresPlanPages } from '../../fixtures/registradoresPlanPages'
import { readCompanyRows } from './readCompanyRows'

describe('readCompanyRows', () => {
  it('reads every result row and skips rows without a selection radio', () => {
    const results = registradoresPlanPages()[6]?.text ?? ''
    const rows = readCompanyRows(`<tr><th>Sociedad</th></tr>${results}`)
    expect(rows).toEqual([
      {
        documentId: 'doc-other',
        name: 'OTRA EMPRESA SA',
        nif: 'A00000000',
        irus: '1000000000001',
        registry: 'MADRID',
        status: 'Vigente',
      },
      {
        documentId: 'doc-1',
        name: 'EJEMPLO ACTIVIDADES SL',
        nif: 'B00000000',
        irus: '1000000000002',
        registry: 'CACERES',
        status: 'Vigente',
      },
    ])
  })
})
