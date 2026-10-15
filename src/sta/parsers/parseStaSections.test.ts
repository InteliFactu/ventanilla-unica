import { describe, expect, it } from 'vitest'

import { parseStaSections } from './parseStaSections'

describe('parseStaSections', () => {
  it('reads each title4 section and its dt/dd entries as text', () => {
    const html = `<h4 class="title4 ">
      Mis Medios de Contacto
    </h4><dl><div class="section-entry "><dt class="entry-label ">Teléfono</dt>
      <dd class="entry-value ">
        600000000	</dd></div></dl>
    <h4 class="title4 ">Mis Datos Identificativos</h4>
    <dt class="entry-label ">DNI/NIE/NIF</dt><dd class="entry-value ">00000000T&nbsp;&nbsp;-&nbsp;Persona F&iacute;sica</dd>
    <h4 class="title4 ">Documentos</h4>`
    expect(parseStaSections(html)).toEqual({
      'Mis Medios de Contacto': { Teléfono: '600000000' },
      'Mis Datos Identificativos': {
        'DNI/NIE/NIF': '00000000T - Persona Física',
      },
      Documentos: {},
    })
  })
})
