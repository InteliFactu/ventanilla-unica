import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { personalDataHtml } from './fixtures/personalDataHtml'
import { parsePersonalDataPage } from './parsers/parsePersonalDataPage'
import { readPersonalData } from './readPersonalData'
import { updateContactData } from './updateContactData'

vi.mock('./readPersonalData', () => ({ readPersonalData: vi.fn() }))

const url =
  'https://portal.seg-social.gob.es/wps/myportal/importass/importass/tramites/datospersonales'
const request = vi.fn()
const client: HttpClient = { request, cookie: () => undefined }
const update = { mobile: '600333444', email: 'nueva@example.org' }

describe('updateContactData', () => {
  beforeEach(() => {
    request.mockReset()
    vi.mocked(readPersonalData).mockResolvedValue(
      parsePersonalDataPage(personalDataHtml(), url),
    )
  })

  it('posts nothing when the page already holds the values', async () => {
    const result = await updateContactData(
      client,
      { mobile: '600111222', email: 'persona@example.org' },
      true,
    )
    expect(result.executed).toBe(false)
    expect(result.plan[0]).toMatch(/nothing to change/)
    expect(request).not.toHaveBeenCalled()
  })

  it('only plans without --confirmar si', async () => {
    const result = await updateContactData(client, update, false)
    expect(result.executed).toBe(false)
    expect(result.plan).toContain('teléfono móvil: 600111222 -> 600333444')
    expect(request).not.toHaveBeenCalled()
  })

  it('posts the modal and proves the change by reading the page again', async () => {
    request.mockResolvedValue({
      status: 200,
      url,
      headers: {},
      body: Buffer.alloc(0),
      text: personalDataHtml('600333444', 'nueva@example.org'),
    })
    const result = await updateContactData(client, update, true)
    expect(result.receipt?.after).toEqual({
      landline: '',
      mobile: '600333444',
      email: 'nueva@example.org',
    })
    const sent = request.mock.calls[0]?.[1] as {
      method: string
      form: Record<string, string>
    }
    expect(sent.method).toBe('POST')
    expect(sent.form).toEqual(
      expect.objectContaining({
        accion: 'ACC_GUARDAR_DATOS_CONTACTO',
        telefonoMovil: '600333444',
        prefijo: '+34',
      }),
    )
  })

  it('fails when the page still shows the old values after saving', async () => {
    request.mockResolvedValue({
      status: 200,
      url,
      headers: {},
      body: Buffer.alloc(0),
      text: personalDataHtml(),
    })
    await expect(updateContactData(client, update, true)).rejects.toThrow(
      /still shows/,
    )
  })
})
