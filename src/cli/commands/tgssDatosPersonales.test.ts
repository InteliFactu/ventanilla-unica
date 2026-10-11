import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { personalDataHtml } from '../../tgss/personalData/fixtures/personalDataHtml'
import { tgssDatosPersonales } from './tgssDatosPersonales'

vi.mock('../../tgss/session/loginToImportass', () => ({
  loginToImportass: vi.fn(),
}))

describe('tgssDatosPersonales', () => {
  it('reads the page and returns the data only', async () => {
    const url =
      'https://portal.seg-social.gob.es/wps/myportal/importass/importass/tramites/datospersonales'
    const client: HttpClient = {
      request: vi.fn().mockResolvedValue({
        status: 200,
        url,
        headers: {},
        body: Buffer.alloc(0),
        text: personalDataHtml(),
      }),
      cookie: () => undefined,
    }
    await expect(tgssDatosPersonales.run(client, {})).resolves.toMatchObject({
      email: 'persona@example.org',
      naf: '280000000000',
    })
  })
})
