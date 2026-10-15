import { describe, expect, it } from 'vitest'

import { parseStaContactData } from './parseStaContactData'

const entry = (label: string, value: string): string =>
  `<div class="section-entry "><dt class="entry-label ">${label}</dt><dd class="entry-value ">
    ${value}	</dd></div>`

const contact = `<h4 class="title4 ">Mis Medios de Contacto</h4><dl>${entry('Teléfono', '600000000')}${entry('Correo electrónico', 'a@example.com')}</dl>`

describe('parseStaContactData', () => {
  it('reads confirmed contact ways, identity and other addresses', () => {
    const html = `${contact}<span>Los medios de contacto han sido confirmados.</span>
      <h4 class="title4 ">Mis Datos Identificativos</h4><dl>${entry('Nombre Completo', 'ANA PRUEBA')}${entry('DNI/NIE/NIF', '00000000T&nbsp;&nbsp;-&nbsp;&nbsp; Persona Física')}${entry('Dirección', 'CALLE A,    1 10004 CACERES')}</dl>
      <div class="mini-seccion">Otras direcciones</div>
      <dl class="seccion section "><div>CALLE B,&nbsp;2</div><div>CALLE C, 3</div></dl>`
    expect(parseStaContactData(html, 'sede.example')).toEqual({
      host: 'sede.example',
      phone: '600000000',
      email: 'a@example.com',
      confirmed: true,
      name: 'ANA PRUEBA',
      nif: '00000000T',
      address: 'CALLE A, 1 10004 CACERES',
      otherAddresses: ['CALLE B, 2', 'CALLE C, 3'],
    })
  })

  it('reports unconfirmed contact ways without identity', () => {
    const html = `${contact}<span>¿Los medios de contacto son correctos?</span><a onclick="PERSCONTACT_YES">Sí</a>`
    expect(parseStaContactData(html, 'h')).toMatchObject({
      confirmed: false,
      name: undefined,
      otherAddresses: [],
    })
  })

  it('refuses a page without the contact section', () => {
    expect(() => parseStaContactData('<html></html>', 'h')).toThrow(
      'no contact data',
    )
  })
})
