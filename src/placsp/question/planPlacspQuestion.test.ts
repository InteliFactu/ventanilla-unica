import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { writeTestPdf } from '../../tgss/attachments/fixtures/writeTestPdf'
import { tenderDetailHtml } from '../fixtures/tenderDetailHtml'
import { mapTenderUrl } from '../mappers/mapTenderUrl'
import { planPlacspQuestion } from './planPlacspQuestion'

const tenderUrl = mapTenderUrl('abcDEF0123456%2B%3D%3D')
const detail = (estado?: string): ReturnType<typeof htmlResponse> =>
  htmlResponse(tenderUrl, tenderDetailHtml(estado))

describe('planPlacspQuestion', () => {
  it('plans the question with the tender read from its public detail', async () => {
    const textFile = await writeTestPdf('q.txt', '¿Se exige la solvencia?')
    const client = scriptedClient(detail())
    const result = await planPlacspQuestion(
      client,
      { tenderUrl, textFile },
      false,
    )
    expect(result.executed).toBe(false)
    expect(result.plan).toContain('¿Se exige la solvencia?')
    expect(result.plan.join('\n')).toContain('expediente 2026/0001')
    expect(result.notes.join('\n')).toContain('asked by 2026-10-07')
    expect(client.request.mock.calls[0]?.[0]).toBe(tenderUrl)
  })

  it('refuses a tender that is no longer published', async () => {
    const textFile = await writeTestPdf('q.txt', 'pregunta')
    await expect(
      planPlacspQuestion(
        scriptedClient(detail('Adjudicada')),
        { tenderUrl, textFile },
        false,
      ),
    ).rejects.toThrow('is "Adjudicada"')
  })

  it('refuses a confirmed question without touching the network', async () => {
    const textFile = await writeTestPdf('q.txt', 'pregunta')
    const client = scriptedClient()
    await expect(
      planPlacspQuestion(client, { tenderUrl, textFile }, true),
    ).rejects.toThrow('cannot send yet')
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
