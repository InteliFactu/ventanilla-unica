import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { tgssActividades } from './tgssActividades'

vi.mock('../../tgss/autonomousActivities/readAutonomousActivities', () => ({
  readAutonomousActivities: vi.fn(async (_client: unknown, outDir: unknown) =>
    Promise.resolve({ outDir }),
  ),
}))

describe('tgssActividades', () => {
  it('is the tgss actividades command and passes --out through', async () => {
    const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

    expect(tgssActividades.portal).toBe('tgss')
    expect(tgssActividades.action).toBe('actividades')
    await expect(
      tgssActividades.run(client, { out: '/tmp/actividades' }),
    ).resolves.toEqual({ outDir: '/tmp/actividades' })
  })
})
