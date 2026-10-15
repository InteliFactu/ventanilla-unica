import { describe, expect, it } from 'vitest'

import { offlineHttpClient } from '../offlineHttpClient'
import { regOrganismos } from './regOrganismos'
import { regPresentar } from './regPresentar'
import { regRegistro } from './regRegistro'
import { regRegistros } from './regRegistros'

describe('reg commands', () => {
  it('reads by default and refuses missing required options', async () => {
    expect(regRegistros.effect).toBeUndefined()
    await expect(
      regRegistros.run(offlineHttpClient, { pagina: '0' }),
    ).rejects.toThrow('--pagina')
    await expect(regRegistro.run(offlineHttpClient, {})).rejects.toThrow(
      '--uuid',
    )
    await expect(regOrganismos.run(offlineHttpClient, {})).rejects.toThrow(
      '--buscar',
    )
  })

  it('makes presentar a write that needs the certificate', async () => {
    expect(regPresentar.effect).toBe('write')
    await expect(regPresentar.run(offlineHttpClient, {})).rejects.toThrow(
      'needs the holder certificate',
    )
  })
})
