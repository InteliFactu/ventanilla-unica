import { describe, expect, it, vi } from 'vitest'

import { readAeatContact } from '../../aeat/contact/readAeatContact'
import { confirmEmail } from '../../carpeta/alerts/confirmEmail'
import { readAlertSettings } from '../../carpeta/alerts/readAlertSettings'
import { requestEmailVerification } from '../../carpeta/alerts/requestEmailVerification'
import { readDehuContact } from '../../dehu/contact/readDehuContact'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { aeatContacto } from './aeatContacto'
import { carpetaAvisos } from './carpetaAvisos'
import { carpetaConfirmarEmail } from './carpetaConfirmarEmail'
import { carpetaEmail } from './carpetaEmail'
import { dehuContacto } from './dehuContacto'

vi.mock('../../aeat/contact/readAeatContact')
vi.mock('../../carpeta/alerts/confirmEmail')
vi.mock('../../carpeta/alerts/readAlertSettings')
vi.mock('../../carpeta/alerts/requestEmailVerification')
vi.mock('../../dehu/contact/readDehuContact')

const address = 'ana@example.org'
const client = scriptedClient()

describe('contact commands', () => {
  it('requires --nif for aeat contacto', async () => {
    await expect(aeatContacto.run(client, {})).rejects.toThrow('--nif')
    await aeatContacto.run(client, { nif: '00000000T' })
    expect(readAeatContact).toHaveBeenCalledWith(client, '00000000T')
  })

  it('reads dehu contacto and carpeta avisos', async () => {
    await dehuContacto.run(client, {})
    await carpetaAvisos.run(client, {})
    expect(readDehuContact).toHaveBeenCalledWith(client)
    expect(readAlertSettings).toHaveBeenCalledWith(client)
  })

  it('keeps carpeta email in plan mode without --confirmar si', async () => {
    expect(carpetaEmail.effect).toBe('write')
    await expect(carpetaEmail.run(client, {})).rejects.toThrow('--email')
    await carpetaEmail.run(client, { email: address })
    expect(requestEmailVerification).toHaveBeenLastCalledWith(
      client,
      address,
      false,
    )
    await carpetaEmail.run(client, {
      email: address,
      confirmar: 'si',
    })
    expect(requestEmailVerification).toHaveBeenLastCalledWith(
      client,
      address,
      true,
    )
  })

  it('keeps carpeta confirmar-email in plan mode without --confirmar si', async () => {
    expect(carpetaConfirmarEmail.effect).toBe('write')
    await expect(carpetaConfirmarEmail.run(client, {})).rejects.toThrow(
      '--enlace',
    )
    await carpetaConfirmarEmail.run(client, { enlace: 'h' })
    expect(confirmEmail).toHaveBeenLastCalledWith(client, 'h', false)
  })
})
