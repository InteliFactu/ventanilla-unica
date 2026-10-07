import type { HttpClient } from '../../../http/types/HttpClient'
import { readProsaPayload } from '../../session/readProsaPayload'
import { tgssUrls } from '../../session/tgssUrls'
import type { ProsaSession } from '../../session/types/ProsaSession'
import { nextProsaAction } from '../nextProsaAction'
import { readAuditFields } from '../parsers/readAuditFields'
import { readXmlErrorMessages } from '../parsers/readXmlErrorMessages'
import { readXmlField } from '../parsers/readXmlField'
import { readXmlMessages } from '../parsers/readXmlMessages'
import { prosaCommonFields } from '../prosaCommonFields'
import type { ProsaEmissionOutcome } from '../types/ProsaEmissionOutcome'

/**
 * Drive the AECPSED1 emission of one document kind: POST the `certificado`
 * option (plus any field that option needs, such as
 * `nifEntidadContratante`) with Continuar, then answer each confirmation screen (situation 68
 * warning, deferred execution) until Imprimir. Every emission counts against
 * the portal's per-subject daily cap. A screen with a message and no
 * document is the portal declining: no debt found, no CCC/NAF, not up to
 * date, or the cap reached.
 */
export const driveProsaEmission = async (
  client: HttpClient,
  session: ProsaSession,
  certificado: string,
  extraFields: Readonly<Record<string, string>> = {},
): Promise<ProsaEmissionOutcome> => {
  const maxConfirmationSteps = 4
  const url = tgssUrls.postForm(session.sessionId)
  const entryFields = {
    ...prosaCommonFields(session.ticket),
    certificado,
    ...extraFields,
    'SPM.ACC.CONTINUAR': 'CONTINUAR',
  }
  const entryResponse = await client.request(url, {
    method: 'POST',
    form: entryFields,
  })
  let payload = readProsaPayload(entryResponse.text)
  if (!readXmlField(payload.xml, 'tipoEjecucion'))
    return {
      issued: false,
      message: readXmlMessages(payload.xml)[0] ?? 'TGSS returned no message',
    }
  for (let step = 0; step < maxConfirmationSteps; step += 1) {
    const action = nextProsaAction(payload.xml)
    const fields = {
      ...prosaCommonFields(payload.ticket),
      ...readAuditFields(payload.xml),
      [`SPM.ACC.${action}`]: action,
    }
    const response = await client.request(url, { method: 'POST', form: fields })
    payload = readProsaPayload(response.text)
    if (action === 'IMPRIMIR') break
  }
  const [refusal] = readXmlErrorMessages(payload.xml)
  if (refusal !== undefined) return { issued: false, message: refusal }
  const messages = readXmlMessages(payload.xml)
  if (messages.length > 0 && !readXmlField(payload.xml, 'DOCDocumento'))
    return { issued: false, message: messages[0] ?? '' }
  return { issued: true, xml: payload.xml }
}
