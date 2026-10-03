import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { writeTestPdf } from '../../tgss/attachments/fixtures/writeTestPdf'
import { placspPregunta } from './placspPregunta'

describe('placspPregunta', () => {
  it('is a write command that refuses confirmation without touching the network', async () => {
    expect(placspPregunta.effect).toBe('write')
    const client = scriptedClient()
    await expect(
      placspPregunta.run(client, {
        expediente: 'abcDEF0123456%2B%3D%3D',
        'texto-file': await writeTestPdf('q.txt', 'pregunta'),
        confirmar: 'si',
      }),
    ).rejects.toThrow('cannot send yet')
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it('needs the tender link and the text file', async () => {
    const client = scriptedClient()
    await expect(placspPregunta.run(client, {})).rejects.toThrow(
      '--expediente is required',
    )
    await expect(
      placspPregunta.run(client, { expediente: 'abcDEF0123456' }),
    ).rejects.toThrow('--texto-file is required')
  })
})
