import { describe, expect, it } from 'vitest'

import { offlineHttpClient } from '../offlineHttpClient'
import { dgsfpReclamacion } from './dgsfpReclamacion'

describe('dgsfpReclamacion', () => {
  it('is a write command that needs the certificate', async () => {
    expect(dgsfpReclamacion.effect).toBe('write')
    await expect(dgsfpReclamacion.run(offlineHttpClient, {})).rejects.toThrow(
      'needs the holder certificate',
    )
  })
})
