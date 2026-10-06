import { describe, expect, it, vi } from 'vitest'

import { acceptJuntaCarpetaNotification } from '../../gobex/notifications/acceptJuntaCarpetaNotification'
import type { HttpClient } from '../../http/types/HttpClient'
import { juntaCarpetaComparecer } from './juntaCarpetaComparecer'

vi.mock('../../gobex/notifications/acceptJuntaCarpetaNotification', () => ({
  acceptJuntaCarpetaNotification: vi.fn(),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('juntaCarpetaComparecer', () => {
  it('is a write command whose description warns about deadlines', async () => {
    expect(juntaCarpetaComparecer.effect).toBe('write')
    expect(juntaCarpetaComparecer.description).toMatch(
      /STARTS every legal deadline/,
    )
    await expect(juntaCarpetaComparecer.run(client, {})).rejects.toThrow('--id')
  })

  it('plans unless --confirmar si, and passes --out', async () => {
    await juntaCarpetaComparecer.run(client, { id: 'N', confirmar: 'yes' })
    expect(acceptJuntaCarpetaNotification).toHaveBeenLastCalledWith(client, {
      id: 'N',
      confirm: false,
      outDir: undefined,
    })
    await juntaCarpetaComparecer.run(client, {
      id: 'N',
      confirmar: 'si',
      out: '/o',
    })
    expect(acceptJuntaCarpetaNotification).toHaveBeenLastCalledWith(client, {
      id: 'N',
      confirm: true,
      outDir: '/o',
    })
  })
})
