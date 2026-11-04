import type { HttpClient } from '../../http/types/HttpClient'
import { postYouthGuaranteeAction } from './fetchers/postYouthGuaranteeAction'
import { resolveYouthGuaranteeMunicipalities } from './fetchers/resolveYouthGuaranteeMunicipalities'
import { mapYouthGuaranteeSubmission } from './mappers/mapYouthGuaranteeSubmission'
import { readYouthGuaranteeFields } from './parsers/readYouthGuaranteeFields'
import { readYouthGuaranteeForm } from './parsers/readYouthGuaranteeForm'
import { readYouthGuaranteeReceipt } from './parsers/readYouthGuaranteeReceipt'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeReceipt } from './types/YouthGuaranteeReceipt'
import type { YouthGuaranteeVerificationFiles } from './types/YouthGuaranteeVerificationFiles'
import { validateYouthGuaranteeAnswers } from './validators/validateYouthGuaranteeAnswers'
import { validateYouthGuaranteePage } from './validators/validateYouthGuaranteePage'
import { validateYouthGuaranteeVerificationFiles } from './validators/validateYouthGuaranteeVerificationFiles'
import { verifyYouthGuaranteeContacts } from './verifyYouthGuaranteeContacts'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

/** No retries: even a lost response may follow a saved or submitted request. */
export const submitYouthGuarantee = async (
  client: HttpClient,
  answers: YouthGuaranteeAnswers,
  confirmed: boolean,
  files: YouthGuaranteeVerificationFiles = {},
): Promise<YouthGuaranteeReceipt> => {
  if (!confirmed)
    throw new Error('Garantía Juvenil: inscription requires --confirmar si')
  validateYouthGuaranteeVerificationFiles(files)
  let page = validateYouthGuaranteePage(
    await client.request(youthGuaranteeUrls.page(1)),
  )
  let resolved = answers
  for (let step = 1; step <= 6; step += 1) {
    validateYouthGuaranteeAnswers(
      { [String(step)]: resolved[String(step)] ?? {} },
      [{ step, title: '', fields: readYouthGuaranteeFields(page.text) }],
    )
    if (step === 2) {
      resolved = await resolveYouthGuaranteeMunicipalities(client, resolved)
      page = await verifyYouthGuaranteeContacts(client, page, resolved, files)
    }
    const form = mapYouthGuaranteeSubmission(
      page.text,
      page.url,
      step,
      resolved,
    )
    page = await postYouthGuaranteeAction(
      client,
      page,
      form,
      `inscription step ${String(step)}`,
    )
    if (step < 6) {
      try {
        readYouthGuaranteeForm(page.text, page.url, step + 1)
      } catch {
        throw new Error(
          `Garantía Juvenil: inscription step ${String(step)} was sent but its outcome is unverified. Do not retry automatically; inspect the portal first.`,
        )
      }
    }
  }
  return readYouthGuaranteeReceipt(page.text)
}
