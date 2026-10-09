import { parseForms } from '../../../html/parsers/parseForms'
import { mapHexText } from '../mappers/mapHexText'
import { mapJsEscape } from '../mappers/mapJsEscape'
import type { RelecSignPage } from '../types/RelecSignPage'

/**
 * The "FIRMA DE SOLICITUD" page TramitaSign answers. Its `firmar()` names the
 * form XML (`var fichero = "<procedure>Form.xml"`), builds the download id
 * `hex("recoverParaFirma"):hex("firmar"):hex(<session>):hex(escape(fichero))`
 * and carries the upload id literally (`var outFileId = '...'`).
 */
export const parseSignPage = (html: string, url: string): RelecSignPage => {
  const justif = parseForms(html, url).find((form) =>
    form.action.endsWith('/Relec/TramitaJustif'),
  )
  const file = /var fichero = "([^"]+)"/.exec(html)?.[1]
  const session = /encodeHex\("firmar"\) \+ ":" \+ encodeHex\("([^"]+)"\)/.exec(
    html,
  )?.[1]
  const outFileId = /var outFileId = '([\da-f:]+)'/.exec(html)?.[1]
  if (!justif || !file || !session || !outFileId)
    throw new Error(
      'TramitaSign did not answer the signing page (no TramitaJustif form or firmar() ids)',
    )
  return {
    justif,
    inFileId: ['recoverParaFirma', 'firmar', session, mapJsEscape(file)]
      .map(mapHexText)
      .join(':'),
    outFileId,
    fileName:
      /var ficheroName = '([^']+)'/.exec(html)?.[1] ?? 'formulario_tramite.xml',
  }
}
