import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { readNafRedAuthorisation } from './readNafRedAuthorisation'

vi.mock('../session/loginWithCertificate', () => ({
  loginWithCertificate: vi.fn(),
}))

describe('readNafRedAuthorisation', () => {
  it('opens RETC0002 and reads the current and past authorisations', async () => {
    const http: HttpClient = { request: vi.fn(), cookie: () => undefined }
    vi.mocked(loginWithCertificate).mockResolvedValue({
      ticket: 't',
      sessionId: 'S1',
      xml:
        '<cccPri id="CCCPRI"><SRAnumAut><![CDATA[NO AS.]]></SRAnumAut></cccPri>' +
        '<fila1Dinamica id="FILA1DINAMICA">PERSONA DE PRUEBA - 000000000T</fila1Dinamica>' +
        '<listaAutorizados><enAutorizado><fecFinRel><![CDATA[05/03/2024]]></fecFinRel>' +
        '<fecIniRel><![CDATA[19/09/2018]]></fecIniRel><RAZrazSoc><![CDATA[GESTORIA DE PRUEBA SL   ]]></RAZrazSoc>' +
        '<SRAnumAut><![CDATA[100000]]></SRAnumAut></enAutorizado></listaAutorizados>',
    })

    const result = await readNafRedAuthorisation(http)

    expect(loginWithCertificate).toHaveBeenCalledWith(http, 'RETC0002')
    expect(result).toEqual({
      titular: 'PERSONA DE PRUEBA - 000000000T',
      autorizacionActual: 'NO AS.',
      historial: [
        {
          autorizacionRed: '100000',
          razonSocial: 'GESTORIA DE PRUEBA SL',
          desde: '19/09/2018',
          hasta: '05/03/2024',
        },
      ],
      notes: [],
    })
  })
})
