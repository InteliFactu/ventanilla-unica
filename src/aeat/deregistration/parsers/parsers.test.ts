import { describe, expect, it } from 'vitest'

import { findDeclaredUuid } from './findDeclaredUuid'
import { findSuccessorNewButton } from './findSuccessorNewButton'
import { parseSuccessors } from './parseSuccessors'
import { readSuccessorError } from './readSuccessorError'

describe('deregistration parsers', () => {
  it('reads --sucesores entries', () => {
    expect(
      parseSuccessors(
        '11111111h; GARCIA ANA ;50;0,00|22222222J;PEREZ LUIS;50;0,00',
      ),
    ).toEqual([
      {
        nif: '11111111H',
        nombre: 'GARCIA ANA',
        porcentaje: '50',
        cuota: '0,00',
      },
      {
        nif: '22222222J',
        nombre: 'PEREZ LUIS',
        porcentaje: '50',
        cuota: '0,00',
      },
    ])
    expect(parseSuccessors(undefined)).toEqual([])
  })

  it('finds a widget whose id follows other properties', () => {
    const blobs = [
      "['zul.db.Datebox','dB1',{format:'dd/MM/yyyy',id:'F_152'},{}]",
    ]
    expect(findDeclaredUuid(blobs, 'F_152')).toBe('dB1')
    expect(() => findDeclaredUuid(blobs, 'NOPE')).toThrow(/NOPE not found/)
  })

  it('finds the Nuevo button of the successor table only', () => {
    const html =
      "['x','a1',{id:'_id_nuevo'}]['x','t1',{id:'tablaSucesores'}]['x','n2',{sclass:'b',id:'_id_nuevo'}]"
    expect(findSuccessorNewButton(html)).toBe('n2')
    expect(() => findSuccessorNewButton('')).toThrow(/successor table/)
  })

  it('reads the successor popup error, if any', () => {
    expect(readSuccessorError('{"rs":[]}')).toBeUndefined()
    expect(
      readSuccessorError(
        "['x','e1',{id:'errorSucesores'}]['x','e2',{value:'NIF incorrecto'}]",
      ),
    ).toBe('NIF incorrecto')
  })
})
