import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { readAeatContact } from './readAeatContact'

const censalUrl = 'https://www1.agenciatributaria.gob.es/m'
const censal = `<td>00000000T</td>
<table class='x' title='Domicilio Fiscal'><tr><td><b>Tipo Vía</b></td><td><b>Nombre Vía</b></td></tr><tr><td>CALLE</td><td>MAYOR</td></tr></table>
<table class='x' title='Domicilio Fiscal'><tr><td><b>Planta</b></td><td><b>Puerta</b></td></tr><tr><td>2</td><td>&nbsp;</td></tr></table>
<table class='x' title='Domicilio de Notificación'><tr><td><b>Código Postal</b></td></tr><tr><td>10001</td></tr></table>`
const avisos = `<p>00000000T</p><strong>Teléfono móvil: </strong><span class="notraducir">600000000</span>
<strong>Correo electrónico: </strong><span>ana@example.org</span>
<strong>Estado: </strong><span>Alta</span><strong>Fecha de estado: </strong><span>01-01-2026</span>`

describe('readAeatContact', () => {
  it('reads the avisos channels and both addresses', async () => {
    const client = scriptedClient(
      htmlResponse(censalUrl, censal),
      htmlResponse('https://www1.agenciatributaria.gob.es/a', avisos),
    )
    await expect(readAeatContact(client, '00000000T')).resolves.toEqual({
      nif: '00000000T',
      mobile: '600000000',
      email: 'ana@example.org',
      avisosState: 'Alta',
      avisosStateDate: '01-01-2026',
      fiscalAddress: {
        'Tipo Vía': 'CALLE',
        'Nombre Vía': 'MAYOR',
        Planta: '2',
      },
      notificationAddress: { 'Código Postal': '10001' },
    })
  })

  it('refuses pages of another holder', async () => {
    const client = scriptedClient(
      htmlResponse(censalUrl, censal),
      htmlResponse('https://www1.agenciatributaria.gob.es/a', '<p>nothing</p>'),
    )
    await expect(readAeatContact(client, '00000000T')).rejects.toThrow(
      'do not belong',
    )
  })

  it('fails on refused pages', async () => {
    const refused = (url: string) => ({ ...htmlResponse(url, ''), status: 403 })
    await expect(
      readAeatContact(scriptedClient(refused(censalUrl)), '00000000T'),
    ).rejects.toThrow('not accepted')
    await expect(
      readAeatContact(
        scriptedClient(
          htmlResponse(censalUrl, censal),
          refused('https://www1.agenciatributaria.gob.es/a'),
        ),
        '00000000T',
      ),
    ).rejects.toThrow('avisos channels page answered HTTP 403')
  })
})
