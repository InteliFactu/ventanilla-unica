import { describe, expect, it } from 'vitest'

import { findNewButtonAfter } from './findNewButtonAfter'
import { parseActivities } from './parseActivities'
import { readPopupError } from './readPopupError'

describe('activity parsers', () => {
  it('reads --actividades entries and drops the epígrafe dots', () => {
    expect(
      parseActivities(
        'a05; 2 ;763;Programadores y Analistas de Informática|A03;1;965.4;Empresas de espectáculos',
      ),
    ).toEqual([
      {
        tipo: 'A05',
        seccion: '2',
        epigrafe: '763',
        descripcion: 'Programadores y Analistas de Informática',
      },
      {
        tipo: 'A03',
        seccion: '1',
        epigrafe: '9654',
        descripcion: 'Empresas de espectáculos',
      },
    ])
    expect(parseActivities(undefined)).toEqual([])
  })

  it('finds the Nuevo button after a marker only', () => {
    const text =
      "['x','a1',{id:'_id_nuevo'}]['x','t1',{id:'tablaActividades'}]['x','n2',{sclass:'b',id:'_id_nuevo'}]"
    expect(findNewButtonAfter(text, "id:'tablaActividades'")).toBe('n2')
    expect(() => findNewButtonAfter(text, 'nope')).toThrow(/after "nope"/)
  })

  it('reads a popup error, if any', () => {
    expect(readPopupError('{"rs":[["rm",["p1"]]]}', 'errorActividades')).toBe(
      undefined,
    )
    expect(
      readPopupError(
        "['x','e1',{id:'errorActividades'}]['x','e2',{value:'Ep\\xEDgrafe incorrecto'}]",
        'errorActividades',
      ),
    ).toBe('Epígrafe incorrecto')
  })
})
