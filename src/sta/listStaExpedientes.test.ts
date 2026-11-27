import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../http/types/HttpClient'
import { listStaExpedientes } from './listStaExpedientes'

const session = '<a href="/sta/CarpetaPrivate/Logout?EXIT=true">Salir</a>'

const openRow =
  '{"numeroFormateado":"2099/00002D","fechaAlta":"20260318","fechaRegistro":"20260317","numAnnotacion":"ENT1","procedimientoDesc":"Ayuda IA","tipoSolicitudDesc":"Solicitud","faseDesc":"Iniciación","estadoDesc":"En tramitación","descripcion":"Copiloto","nombreCompleto":"VIBRA LAB SL"}'

const archivedRow = '{"numeroFormateado":"2019/1A","fechaAlta":"20190101"}'

const fakeClient = (): HttpClient => ({
  request: vi
    .fn<HttpClient['request']>()
    .mockImplementation(async (url, options) => {
      const archived =
        options?.form?.['eventArguments'] === 'SELECTED=ARCHIVADOS'
      const text = url.includes('submitAjax')
        ? archived
          ? `<zones><![CDATA[var ds_EXPEDIENTES_FULL_ARCHIVADOS = [${archivedRow}];]]></zones>`
          : ''
        : `${session}<script>var ds_EXPEDIENTES_FULL_ENCURSO = [${openRow}];</script>`
      return Promise.resolve({
        status: 200,
        url,
        headers: {},
        body: Buffer.from(text),
        text,
      })
    }),
  cookie: () => undefined,
})

describe('listStaExpedientes', () => {
  it('lists open and archived expedientes', async () => {
    const result = await listStaExpedientes(fakeClient(), 'junta')
    expect(result.host).toBe('tramites.juntaex.es')
    expect(result.expedientes).toEqual([
      {
        number: '2099/00002D',
        archived: false,
        openedOn: '2026-03-18',
        registeredOn: '2026-03-17',
        registryEntry: 'ENT1',
        procedure: 'Ayuda IA',
        requestType: 'Solicitud',
        phase: 'Iniciación',
        status: 'En tramitación',
        description: 'Copiloto',
        holder: 'VIBRA LAB SL',
      },
      expect.objectContaining({
        number: '2019/1A',
        archived: true,
        openedOn: '2019-01-01',
      }),
    ])
  })
})
