import type { VisorSession } from '../types/VisorSession'

/** Read the CSRF token, flow execution, expediente code and procedimiento the visor page declares. */
export const parseVisorSession = (html: string, url: string): VisorSession => {
  const csrf = /<meta name="_csrf" content="([^"]+)"/.exec(html)?.[1]
  const execution = /id="petAjax" execution='([^']+)'/.exec(html)?.[1]
  const codExpediente = /var codExpediente = '([^']+)'/.exec(html)?.[1]
  const procedimiento = /var procedimiento = "([^"]+)"/.exec(html)?.[1]
  if (html.includes('No tiene acceso al procedimiento'))
    throw new Error(
      'Justicia: the visor refuses this expediente ("No tiene acceso al procedimiento": the holder is not registered as a party, or it does not meet the access rules)',
    )
  if (!csrf || !execution || !codExpediente || !procedimiento)
    throw new Error(`Justicia: the visor page at ${url} is not an expediente`)
  return { url, csrf, execution, codExpediente, procedimiento }
}
