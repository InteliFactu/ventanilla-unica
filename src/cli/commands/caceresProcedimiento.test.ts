import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { fakeRegistryClient } from '../../sta/registry/fixtures/fakeRegistryClient'
import { postsOf } from '../../sta/registry/fixtures/postsOf'
import { relecTramiteRoutes } from '../../sta/relec/fixtures/relecTramiteRoutes'
import { caceresProcedimiento } from './caceresProcedimiento'

describe('caceresProcedimiento', () => {
  it('refuses a malformed dboid before any request', async () => {
    const request = vi.fn<HttpClient['request']>()
    await expect(
      caceresProcedimiento.run(
        { request, cookie: () => undefined },
        { dboid: '123' },
      ),
    ).rejects.toThrow('--dboid')
    expect(request).not.toHaveBeenCalled()
  })

  it('lists only the extra text fields the filing command can set', async () => {
    const client = fakeRegistryClient(relecTramiteRoutes)
    await expect(
      caceresProcedimiento.run(client, { dboid: '6269000000000000000001' }),
    ).resolves.toMatchObject({
      variables: [
        { name: 'ANNOT_TEXT_EXTRACT', label: 'Asunto' },
        { name: 'DETAIL_TEST', label: 'Additional detail' },
        { name: 'TEXT_TEST', label: 'Additional text' },
        { name: 'DEFAULT_DETAIL', label: 'Existing detail' },
        { name: 'HIDDEN_DETAIL', label: 'Hidden metadata' },
      ],
      editableFields: [
        { name: 'DETAIL_TEST', label: 'Additional detail' },
        { name: 'TEXT_TEST', label: 'Additional text' },
        { name: 'DEFAULT_DETAIL', label: 'Existing detail' },
      ],
    })
    expect(postsOf(client).map(({ url }) => new URL(url).pathname)).toEqual([
      '/sta/frame.jsp',
    ])
  })
})
