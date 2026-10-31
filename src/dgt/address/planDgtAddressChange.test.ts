import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { dgtAtexAnswer } from '../fixtures/dgtAtexAnswer'
import { dgtJsonResponse } from '../fixtures/dgtJsonResponse'
import { dgtLoginResponses } from '../fixtures/dgtLoginResponses'
import { dgtUrls } from '../session/dgtUrls'
import { planDgtAddressChange } from './planDgtAddressChange'

const same = {
  nif: '12345678Z',
  tipoVia: 'CALLE',
  via: 'MAYOR',
  numero: '7',
  planta: '',
  puerta: '',
  cp: '28001',
  municipio: 'MADRID',
  provincia: 'MADRID',
  localidad: '',
}

const plannedClient = (): ReturnType<typeof scriptedClient> =>
  scriptedClient(
    ...dgtLoginResponses(),
    dgtJsonResponse(dgtUrls.atex, dgtAtexAnswer),
  )

describe('planDgtAddressChange', () => {
  it('refuses to confirm before any request', async () => {
    const client = scriptedClient()
    await expect(planDgtAddressChange(client, same, true)).rejects.toThrow(
      /cannot submit yet/,
    )
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it('says when the DGT already notifies to the requested address', async () => {
    const result = await planDgtAddressChange(plannedClient(), same, false)
    expect(result.executed).toBe(false)
    expect(result.plan[0]).toMatch(/already notifies to this address/)
  })

  it('lists the CDI requests for another address and posts nothing else', async () => {
    const client = plannedClient()
    const result = await planDgtAddressChange(
      client,
      { ...same, numero: '9', planta: '2', puerta: 'B' },
      false,
    )
    expect(result.plan).toEqual(
      expect.arrayContaining([
        'Holder ANA PEREZ GIL (12345678Z)',
        'Current notification address: CALLE MAYOR, 7, 28001 Madrid, (Madrid)',
        expect.stringContaining("tramite: 'CDI'"),
        expect.stringContaining('asunto SCDCB'),
      ]),
    )
    const urls = client.request.mock.calls.map(([url]) => url)
    expect(urls).not.toContain(dgtUrls.addressChangeAct)
    expect(urls).not.toContain(dgtUrls.addressChangeRegistry)
    expect(urls[0]).toBe(dgtUrls.addressChangePage)
  })

  it('refuses a session that belongs to another holder', async () => {
    await expect(
      planDgtAddressChange(
        plannedClient(),
        { ...same, nif: '87654321X' },
        false,
      ),
    ).rejects.toThrow('belongs to 12345678Z')
  })
})
