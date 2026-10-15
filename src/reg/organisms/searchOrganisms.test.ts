import { describe, expect, it } from 'vitest'

import { fakeRegClient } from '../fixtures/fakeRegClient'
import { searchOrganisms } from './searchOrganisms'

describe('searchOrganisms', () => {
  it('searches DIR3 by text with the bearer session', async () => {
    const client = fakeRegClient()
    const found = await searchOrganisms(client, 'Ayuntamiento de Prueba')
    expect(found.items[0]?.cdUtOrganic).toBe('L01100000')
    expect(client.calls.at(-1)?.url).toBe(
      'https://reg-api.redsara.es/dir3/search?searchText=Ayuntamiento%20de%20Prueba',
    )
  })
})
