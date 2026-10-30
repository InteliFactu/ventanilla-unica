import { describe, expect, it, vi } from 'vitest'

import { removeDehuContactEmail } from '../../dehu/contactEmailRemoval/removeDehuContactEmail'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { dehuQuitarEmail } from './dehuQuitarEmail'

vi.mock('../../dehu/contactEmailRemoval/removeDehuContactEmail')

describe('dehu quitar-email', () => {
  const client = scriptedClient()
  const email = 'a@example.org'

  it('requires --email and only plans without --confirmar si', async () => {
    await expect(dehuQuitarEmail.run(client, {})).rejects.toThrow('--email')
    await dehuQuitarEmail.run(client, { email })
    expect(removeDehuContactEmail).toHaveBeenLastCalledWith(
      client,
      email,
      false,
    )
    expect(dehuQuitarEmail.effect).toBe('write')
  })

  it('applies with --confirmar si', async () => {
    await dehuQuitarEmail.run(client, {
      email,
      confirmar: 'si',
    })
    expect(removeDehuContactEmail).toHaveBeenLastCalledWith(client, email, true)
  })
})
