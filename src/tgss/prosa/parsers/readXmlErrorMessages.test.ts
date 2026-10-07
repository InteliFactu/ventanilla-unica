import { describe, expect, it } from 'vitest'

import { readXmlErrorMessages } from './readXmlErrorMessages'

describe('readXmlErrorMessages', () => {
  it('reads only the ERROR messages', () => {
    const xml =
      '<MESSAGES><MESSAGE>\n<TIPO>ERROR</TIPO>\n' +
      '<TEXTO><![CDATA[NO SE HA ENCONTRADO DEUDA   .]]></TEXTO></MESSAGE>' +
      '<MESSAGE><TIPO>INFO</TIPO><TEXTO><![CDATA[Emitido]]></TEXTO></MESSAGE></MESSAGES>'

    expect(readXmlErrorMessages(xml)).toEqual(['NO SE HA ENCONTRADO DEUDA .'])
  })

  it('answers nothing for a screen without messages', () => {
    expect(readXmlErrorMessages('<ProsaXMLData/>')).toEqual([])
  })
})
