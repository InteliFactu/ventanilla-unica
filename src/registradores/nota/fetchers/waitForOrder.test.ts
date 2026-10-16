import { describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import { waitForOrder } from './waitForOrder'

describe('waitForOrder', () => {
  it('gives up after twenty answers that are not true', async () => {
    const pending = htmlResponse(
      'https://sede.registradores.org/site/x',
      'false',
    )
    const client = scriptedClient(...Array.from({ length: 20 }, () => pending))
    const sleep = vi.fn(async (): Promise<void> => {})
    await expect(waitForOrder(client, sleep)).rejects.toThrow('not complete')
    expect(sleep).toHaveBeenCalledTimes(19)
  })
})
