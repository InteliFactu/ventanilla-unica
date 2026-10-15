import { describe, expect, it } from 'vitest'

import { parseStaPadron } from './parseStaPadron'

const entry = (label: string, value: string): string =>
  `<dt class="entry-label ">${label}</dt><dd class="entry-value ">${value}</dd>`

describe('parseStaPadron', () => {
  it('reads the padrón sections and the people at the same address', () => {
    const rows = [
      {
        nombreCompleto: 'ANA  PRUEBA  DOS',
        fechaNacimiento: '01/02/2018',
        sexo: 'Mujer',
        menor: true,
      },
    ]
    const html = `<h4 class="title4 ">Identificación del ciudadano</h4>
      ${entry('Nombre', 'ANA  PRUEBA')}${entry('Documento', 'DNI: 00000000-T')}${entry('Fecha alta padrón', '01/05/1996')}${entry('Dirección', 'CALLE A,    1 PBJ')}${entry('Nacionalidad', 'ESPAÑOLA')}
      <h4 class="title4 ">Lugar de nacimiento</h4>${entry('Fecha de nacimiento', '10/08/1987')}${entry('Nacimiento', 'CACERES')}
      <h4 class="title4 ">Datos académicos</h4>${entry('Nivel de instrucción', '20-X')}
      <h4 class="title4 ">Residentes en el mismo domicilio</h4>
      <script>var ds_habitantes_DATOS_HABITANTE = ${JSON.stringify(rows)};</script>
      <h4 class="title4 ">Datos censo electoral</h4>${entry('Distrito', '01')}${entry('Sección', '10')}`
    expect(parseStaPadron(html, 'h')).toEqual({
      host: 'h',
      registered: true,
      name: 'ANA PRUEBA',
      document: 'DNI: 00000000-T',
      since: '01/05/1996',
      address: 'CALLE A, 1 PBJ',
      nationality: 'ESPAÑOLA',
      birthDate: '10/08/1987',
      birthPlace: 'CACERES',
      education: '20-X',
      district: '01',
      section: '10',
      cohabitants: [
        {
          name: 'ANA PRUEBA DOS',
          birthDate: '01/02/2018',
          sex: 'Mujer',
          minor: true,
        },
      ],
    })
  })

  it('answers registered: false when the sede says so', () => {
    expect(
      parseStaPadron(
        '<p>No se encuentra empadronado/a en este municipio</p>',
        'h',
      ),
    ).toEqual({ host: 'h', registered: false, cohabitants: [] })
  })

  it('refuses the search error and an unknown page', () => {
    expect(() =>
      parseStaPadron(
        'Se ha producido un error al buscar los datos del padrón',
        'h',
      ),
    ).toThrow('could not search')
    expect(() => parseStaPadron('<html></html>', 'h')).toThrow('no padrón data')
  })
})
