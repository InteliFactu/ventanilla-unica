import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { readQuestionText } from '../fetchers/readQuestionText'
import { mapQuestionDeadline } from '../mappers/mapQuestionDeadline'
import { mapQuestionPlan } from '../mappers/mapQuestionPlan'
import { readTenderDetail } from '../parsers/readTenderDetail'
import type { QuestionQuery } from '../types/QuestionQuery'
import type { QuestionReceipt } from '../types/QuestionReceipt'

/**
 * Plan a question to the contracting body of a published tender. Without
 * confirmation it reads the text and the tender's public detail and prints
 * the steps. With confirmation it refuses before any request: asking needs
 * a PLACSP operator account (user id and password), and the logged-in
 * "Solicitar Información" form has not been captured.
 */
export const planPlacspQuestion = async (
  client: HttpClient,
  query: QuestionQuery,
  confirmed: boolean,
): Promise<WriteResult<QuestionReceipt>> => {
  const text = await readQuestionText(query.textFile)
  if (confirmed)
    throw new Error(
      'placsp pregunta cannot send yet: it needs a PLACSP operator account and the logged-in "Solicitar Información" form has not been captured. Nothing was sent.',
    )
  const page = await client.request(query.tenderUrl)
  const tender = readTenderDetail(page.text, page.url)
  if (tender.estado !== 'Publicada')
    throw new Error(
      `PLACSP: expediente ${tender.expediente} is "${tender.estado}"; questions are for published tenders`,
    )
  const deadline = mapQuestionDeadline(tender.finPresentacion)
  return {
    action: 'placsp pregunta',
    executed: false,
    plan: mapQuestionPlan(tender, text),
    notes: [
      `Tender: ${tender.expediente}, ${tender.objeto} (${tender.organoContratacion}); offers until ${tender.finPresentacion ?? 'unknown'}.`,
      ...(deadline
        ? [
            `Under the ordinary Article 138.3 LCSP rule, the 12-day calendar reference for requesting information is ${deadline.askBy}, and the response is due no later than 6 days before ${deadline.submissionEnd}.`,
          ]
        : []),
      'The tender documents may set a different period. Check the question cutoff shown in "Solicitar Información".',
      'For urgent works, supply or service contracts subject to EU harmonised rules under an open or restricted procedure, the response is due no later than 4 days before the submission deadline.',
      'Read-only so far: the public tender detail. Sending needs --confirmar si, an operator account and a captured question form.',
    ],
  }
}
