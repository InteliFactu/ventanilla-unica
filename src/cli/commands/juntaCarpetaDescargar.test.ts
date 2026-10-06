import { describe, expect, it, vi } from 'vitest'

import { downloadJuntaCarpetaNotification } from '../../gobex/notifications/downloadJuntaCarpetaNotification'
import type { HttpClient } from '../../http/types/HttpClient'
import { juntaCarpetaDescargar } from './juntaCarpetaDescargar'

vi.mock('../../gobex/notifications/downloadJuntaCarpetaNotification', () => ({
  downloadJuntaCarpetaNotification: vi.fn(),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('juntaCarpetaDescargar', () => {
  it('is a read command that needs --id and --out', async () => {
    expect(juntaCarpetaDescargar.effect).toBeUndefined()
    await expect(juntaCarpetaDescargar.run(client, {})).rejects.toThrow('--id')
    await expect(
      juntaCarpetaDescargar.run(client, { id: 'N' }),
    ).rejects.toThrow('--out')
  })

  it('delegates', async () => {
    await juntaCarpetaDescargar.run(client, { id: 'N', out: '/o' })
    expect(downloadJuntaCarpetaNotification).toHaveBeenCalledWith(
      client,
      'N',
      '/o',
    )
  })
})
