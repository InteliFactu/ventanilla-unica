import { describe, expect, it } from 'vitest'

import { parseDeclarationFileForm } from './parseDeclarationFileForm'
import { parseDeclarationFileHolder } from './parseDeclarationFileHolder'

describe('Envío Fichero parsers', () => {
  it('finds the desktop and the Leer declaración upload button', () => {
    const html = String.raw`dt:'z_ab\x2Dcd' ['zul.wgt.Button','vNqKf0',{id:'btnLeerDeclaracionUpl',$ZKAUS$:true,upload:'true,maxsize=15000'},{},[]]`
    expect(parseDeclarationFileForm(html)).toEqual({
      desktopId: 'z_ab-cd',
      readUuid: 'vNqKf0',
    })
    expect(() => parseDeclarationFileForm("dt:'z_1'")).toThrow(
      /Leer declaración/,
    )
  })

  it('reads the holder off the summary, unescaping its name', () => {
    const answer = String.raw`{id:'SPNIF',value:'E67686287'},{},[]],['zul.wgt.Label','x',{id:'SPNOM',value:'PE\xD1A ESPJ'}`
    expect(parseDeclarationFileHolder(answer)).toEqual({
      nif: 'E67686287',
      nombre: 'PEÑA ESPJ',
    })
    expect(parseDeclarationFileHolder(String.raw`{id:'SPNIF'}`)).toBeUndefined()
  })
})
