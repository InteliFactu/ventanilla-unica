import { describe, expect, it, vi } from 'vitest'

import { downloadAeatCsvDocument } from '../../aeat/csvDocument/downloadAeatCsvDocument'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { aeatCotejo } from './aeatCotejo'

vi.mock('../../aeat/csvDocument/downloadAeatCsvDocument')

describe('aeat cotejo', () => {
  const client = scriptedClient()

  it('requires --csv and --out and stays read-only', async () => {
    await expect(aeatCotejo.run(client, { out: 'd' })).rejects.toThrow('--csv')
    await expect(aeatCotejo.run(client, { csv: 'C' })).rejects.toThrow('--out')
    await aeatCotejo.run(client, { csv: 'C', out: 'd' })
    expect(downloadAeatCsvDocument).toHaveBeenLastCalledWith(client, {
      csv: 'C',
      nif: '',
      out: 'd',
    })
    expect(aeatCotejo.effect).toBeUndefined()
  })
})
