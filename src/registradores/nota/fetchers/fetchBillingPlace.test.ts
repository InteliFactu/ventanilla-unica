import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import { fetchBillingPlace } from './fetchBillingPlace'

const url = 'https://sede.registradores.org/site/api/x'

describe('fetchBillingPlace', () => {
  it('refuses a company without a province', async () => {
    const client = scriptedClient(htmlResponse(url, '{"valid":false}'))
    await expect(
      fetchBillingPlace(client, 'B00000000', 'Cáceres'),
    ).rejects.toThrow('no province')
  })

  it('asks for --municipio when the town is not in the province', async () => {
    const client = scriptedClient(
      htmlResponse(url, '{"provinceCodes":[28]}'),
      htmlResponse(url, '[{"value":79,"label":"Madrid"}]'),
    )
    await expect(
      fetchBillingPlace(client, 'B00000000', 'PALMA'),
    ).rejects.toThrow('pass --municipio')
  })

  it('refuses an answer that is not JSON', async () => {
    const client = scriptedClient(htmlResponse(url, '<html>login</html>'))
    await expect(fetchBillingPlace(client, 'B00000000', 'x')).rejects.toThrow(
      'api/validate/sociedad did not answer JSON',
    )
  })
})
