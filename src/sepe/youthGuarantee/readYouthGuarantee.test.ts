import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { youthGuaranteeReadResponses } from './fixtures/youthGuaranteeReadResponses'
import { readYouthGuarantee } from './readYouthGuarantee'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

describe('read Garantía Juvenil', () => {
  it('logs in with AFIRMA and reads all six steps without a save or validation POST', async () => {
    const client = scriptedClient(...youthGuaranteeReadResponses())
    const result = await readYouthGuarantee(client)
    expect(result).toMatchObject({
      inscribed: false,
      state: 'not-inscribed',
      registrationDate: null,
      documents: [],
    })
    expect(result.form.map((page) => page.step)).toEqual([1, 2, 3, 4, 5, 6])
    expect(client.request.mock.calls[2]?.[1]?.form?.['SelectedIdP']).toBe(
      'AFIRMA',
    )
    expect(
      client.request.mock.calls
        .slice(4)
        .every(
          ([, options]) =>
            options?.method === undefined && options?.form === undefined,
        ),
    ).toBe(true)
  })
  it('reads an already-inscribed holder without opening the inscription wizard', async () => {
    const client = scriptedClient(
      ...youthGuaranteeReadResponses(
        '<a href="./logout">Salir</a><p>Estado: alta</p><p>Fecha de inscripción: 02/03/2024</p>',
      ).slice(0, 4),
    )
    expect(await readYouthGuarantee(client)).toMatchObject({
      inscribed: true,
      state: 'alta',
      registrationDate: '02/03/2024',
      form: [],
    })
    expect(client.request.mock.calls).toHaveLength(4)
  })
  it('does not infer absence when history contains records', async () => {
    const responses = youthGuaranteeReadResponses()
    responses[4] = htmlResponse(
      youthGuaranteeUrls.history,
      '{"recordsTotal":2,"data":[]}',
    )
    expect(
      await readYouthGuarantee(scriptedClient(...responses)),
    ).toMatchObject({ inscribed: null, state: 'unknown' })
  })
  it('rejects an expired authenticated page', async () => {
    const responses = youthGuaranteeReadResponses()
    responses[6] = htmlResponse(
      youthGuaranteeUrls.page(2),
      '<title>Entrada de usuarios</title>',
    )
    await expect(
      readYouthGuarantee(scriptedClient(...responses)),
    ).rejects.toThrow(/session may have expired/)
  })
  it('does not mistake a JSON error or login page for empty history', async () => {
    const responses = youthGuaranteeReadResponses()
    responses[4] = htmlResponse(
      youthGuaranteeUrls.history,
      '{"errorCustom":"Unavailable"}',
    )
    await expect(
      readYouthGuarantee(scriptedClient(...responses)),
    ).rejects.toThrow(/unrecognized inscription history/)
  })

  it('refuses a failed history envelope even when its default total is zero', async () => {
    const responses = youthGuaranteeReadResponses()
    responses[4] = htmlResponse(
      youthGuaranteeUrls.history,
      '{"recordsTotal":0,"data":[],"errorCustom":"History unavailable"}',
    )
    await expect(
      readYouthGuarantee(scriptedClient(...responses)),
    ).rejects.toThrow(/history/)
  })
})
