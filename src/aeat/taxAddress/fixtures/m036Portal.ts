import { vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { m036IndexHtml } from './m036IndexHtml'
import { zkWidget as widget } from './zkWidget'

/**
 * A synthetic BU36-M036 desktop: `index.zul` declares the page widgets and
 * each zkau answer is chosen by the uuid the event targets.
 */
export const m036Portal = (
  overrides: Readonly<Record<string, string>> = {},
): ReturnType<typeof vi.fn<HttpClient['request']>> => {
  const answers: Readonly<Record<string, string>> = {
    bBus: [
      widget('cp', 'codigoPostal'),
      widget('bcp', 'botonBuscarCodPostal'),
      widget('nvf', 'nombreViaFiltro'),
      widget('lvb', 'listadoViasBuscador'),
      widget('bsel', 'botonSeleccionar'),
    ].join(''),
    nvf: "['zul.sel.Listitem','li1',{label:'CALLE MAYOR'}]",
    bVal: "[{value:'00000'},{value:'Sin errores'}]",
    bFirm: `[{value:'00000'},{value:'OK'}]${widget('chA', 'chAceptar')}${widget('bAE', 'btnAceptarEnvio')}`,
    bAE: "['onPresenvali',[{'kls':'k1','codErr':'0'}]]",
    '': "[{label:'Presentaci\\xf3n realizada'},{value:' '}] <a href='/wlpl/BU36-M036/justificante?id=1'>",
    ...overrides,
  }
  return vi.fn<HttpClient['request']>(async (url, options) => {
    const text = url.endsWith('/index.zul')
      ? m036IndexHtml()
      : url.endsWith('/zkau')
        ? (answers[options?.form?.['uuid_0'] ?? ''] ?? '')
        : ''
    return Promise.resolve({
      status: 200,
      url,
      headers: {},
      body: Buffer.from(text),
      text,
    })
  })
}
