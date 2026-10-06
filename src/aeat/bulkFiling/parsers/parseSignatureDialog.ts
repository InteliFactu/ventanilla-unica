import type { BulkSignatureDialog } from '../types/BulkSignatureDialog'

/** MostrarDlgFirma: the presentarAjax(idEnvio, nif, nombre) call and the type 1 record shown in the textarea. */
export const parseSignatureDialog = (html: string): BulkSignatureDialog => {
  const call = /presentarAjax\("([^"]+)", "([^"]+)", "([^"]+)"\)/.exec(html)
  const shown = /<textarea[^>]*>([^<]*)<\/textarea>/.exec(html)
  if (!call || !shown)
    throw new Error(
      'TGVI: the signature window has no presentarAjax call or no record to sign; nothing is filed',
    )
  const [, idEnvio = '', nif = '', nombre = ''] = call
  return { idEnvio, nif, nombre, header: shown[1] ?? '' }
}
