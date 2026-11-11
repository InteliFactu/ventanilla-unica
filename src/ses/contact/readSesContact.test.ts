import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { sesUrls } from '../session/sesUrls'
import { readSesContact } from './readSesContact'

const datos = `<div id="formDatosPersonales:tabViewDatos:tabDatosContacto">
<span class="negrita">Correo: </span><span id="formDatosPersonales:tabViewDatos:correo">ana@example.org</span>
<span class="negrita">Tlf. Contacto Asistencial: </span><span id="formDatosPersonales:tabViewDatos:mvl">600000000</span>
<span class="negrita">Teléfono 1: </span><span id="formDatosPersonales:tabViewDatos:tlf1">924000000</span>
<span class="negrita">Teléfono 2: </span><span id="formDatosPersonales:tabViewDatos:tlf2"></span>
<span class="negrita">Dirección: </span><span id="formDatosPersonales:tabViewDatos:dir">CALLE MAYOR</span></div>`

describe('readSesContact', () => {
  it('logs in without following the HTTP redirect and reads the contact tab', async () => {
    const client = scriptedClient(
      { ...htmlResponse(sesUrls.certificateLogin, ''), status: 302 },
      htmlResponse(sesUrls.personalData, datos),
    )
    await expect(readSesContact(client)).resolves.toEqual({
      email: 'ana@example.org',
      careContactPhone: '600000000',
      phone1: '924000000',
      phone2: null,
    })
    expect(client.request.mock.calls[0]).toEqual([
      sesUrls.certificateLogin,
      { followRedirects: false },
    ])
  })

  it('refuses a page without the contact data', async () => {
    const client = scriptedClient(
      { ...htmlResponse(sesUrls.certificateLogin, ''), status: 302 },
      htmlResponse(sesUrls.personalData, '<p>Acceso</p>'),
    )
    await expect(readSesContact(client)).rejects.toThrow('no contact data')
  })
})
