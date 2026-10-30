import { describe, expect, it, vi } from 'vitest'

import { listAeatPowers } from '../../aeat/powers/listAeatPowers'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { aeatApoderamientos } from './aeatApoderamientos'

vi.mock('../../aeat/powers/listAeatPowers')

describe('aeat apoderamientos', () => {
  const client = scriptedClient()

  it('requires --nif and defaults to the granted powers', async () => {
    await expect(aeatApoderamientos.run(client, {})).rejects.toThrow('--nif')
    await aeatApoderamientos.run(client, { nif: '00000000T' })
    expect(listAeatPowers).toHaveBeenLastCalledWith(
      client,
      '00000000T',
      'granted',
    )
  })

  it('reads the received powers with --tipo recibidos and stays read-only', async () => {
    await aeatApoderamientos.run(client, {
      nif: '00000000T',
      tipo: 'recibidos',
    })
    expect(listAeatPowers).toHaveBeenLastCalledWith(
      client,
      '00000000T',
      'received',
    )
    expect(aeatApoderamientos.effect).toBeUndefined()
  })
})
