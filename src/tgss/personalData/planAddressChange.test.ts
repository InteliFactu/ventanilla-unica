import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { personalDataHtml } from './fixtures/personalDataHtml'
import { parsePersonalDataPage } from './parsers/parsePersonalDataPage'
import { planAddressChange } from './planAddressChange'
import { readPersonalData } from './readPersonalData'

vi.mock('./readPersonalData', () => ({ readPersonalData: vi.fn() }))

const url =
  'https://portal.seg-social.gob.es/wps/myportal/importass/importass/tramites/datospersonales'
const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
const same = {
  tipoVia: 'CL',
  nombreVia: 'MAYOR',
  numero: '5',
  bis: '',
  bloque: '',
  escalera: '',
  piso: '2',
  puerta: 'B',
  codigoPostal: '28001',
  localidad: 'MADRID',
}

describe('planAddressChange', () => {
  beforeEach(() => {
    vi.mocked(readPersonalData)
      .mockReset()
      .mockResolvedValue(parsePersonalDataPage(personalDataHtml(), url))
  })

  it('refuses to confirm before any request', async () => {
    await expect(planAddressChange(client, same, true)).rejects.toThrow(
      /cannot submit yet/,
    )
    expect(readPersonalData).not.toHaveBeenCalled()
  })

  it('says when the domicile is already the requested one', async () => {
    const result = await planAddressChange(client, same, false)
    expect(result.plan[0]).toMatch(/already holds this domicile/)
  })

  it('lists the form it would post for another domicile', async () => {
    const result = await planAddressChange(
      client,
      { ...same, numero: '7' },
      false,
    )
    expect(result.executed).toBe(false)
    expect(result.plan[1]).toBe(
      'Current domicile: Cl. MAYOR 5, piso 2, pta. B, 28001, MADRID',
    )
    expect(result.plan[2]).toContain('"numero":"7"')
    expect(result.plan[2]).toContain('"accion":"ACC_GUARDAR_DOMICILIO"')
  })
})
