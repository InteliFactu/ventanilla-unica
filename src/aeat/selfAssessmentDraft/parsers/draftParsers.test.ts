import { describe, expect, it } from 'vitest'

import { parseDraftFileHeader } from './parseDraftFileHeader'
import { parseDraftForm } from './parseDraftForm'
import { parseDraftNotices } from './parseDraftNotices'
import { parseDraftPdfPath } from './parseDraftPdfPath'

const row = (tooltip: string, line: string, code: string, text: string) =>
  String.raw`['zul.grid.Row','r',{zclass:'lineasTablaErrores',cssflex:false},{},[` +
  String.raw`['zul.wgt.Image','i',{tooltiptext:'${tooltip}',src:'x.png'},{},[]],` +
  String.raw`['zul.wgt.Label','a',{cssflex:false,value:'${line}'},{},[]],` +
  String.raw`['zul.wgt.Label','b',{sclass:'negrita',cssflex:false,value:'${code}'},{},[]],` +
  String.raw`['zul.wgt.Div','c',{},{},[['zul.wgt.Label','d',{cssflex:false,value:'${text}'},{},[]]]]]]`

describe('simulator draft parsers', () => {
  it('reads model, exercise and period off the opening tag', () => {
    expect(parseDraftFileHeader(Buffer.from('<T303020263T0000><AUX>'))).toEqual(
      {
        modelo: '303',
        ejercicio: '2026',
        periodo: '3T',
      },
    )
    expect(() => parseDraftFileHeader(Buffer.from('hello'))).toThrow(
      /model tag/,
    )
  })

  it('finds the desktop and the Importar and Vista previa buttons', () => {
    const html = String.raw`dt:'z_ab\x2Dcd' ['zul.wgt.Button','u1',{$onClick:true,sclass:'cmd__importacion',label:'Importar'},{},[]] ['zul.wgt.Button','u2',{$onClick:true,sclass:'cmd__aeatPresentarBorrador',label:'Vista previa'},{},[]]`
    expect(parseDraftForm(html)).toEqual({
      desktopId: 'z_ab-cd',
      importUuid: 'u1',
      previewUuid: 'u2',
    })
  })

  it('reads every notice row with its kind', () => {
    const answer =
      row(
        'Error',
        '1',
        'E010170',
        String.raw`Caracteres no v\xE1lidos \'Opci\xF3n\'`,
      ) +
      row(
        'Aviso',
        '1',
        '31190',
        String.raw`Revise \"Informaci\xF3n adicional\".`,
      ) +
      row('Correcto', '-', '00001', 'No existen errores.')
    expect(parseDraftNotices(answer)).toEqual([
      {
        kind: 'error',
        line: '1',
        code: 'E010170',
        description: "Caracteres no válidos 'Opción'",
      },
      {
        kind: 'aviso',
        line: '1',
        code: '31190',
        description: 'Revise "Información adicional".',
      },
      {
        kind: 'correcto',
        line: '-',
        code: '00001',
        description: 'No existen errores.',
      },
    ])
  })

  it('finds the rendered PDF in the Vista previa answer', () => {
    expect(
      parseDraftPdfPath(
        "['zul.wgt.Iframe','f',{src:'/wlpl/A303-FWME/pwda/zkau/view/z_x/u/2c2/1/PDFborrador.pdf'}]",
      ),
    ).toBe('/wlpl/A303-FWME/pwda/zkau/view/z_x/u/2c2/1/PDFborrador.pdf')
    expect(parseDraftPdfPath('nothing')).toBeUndefined()
  })
})
