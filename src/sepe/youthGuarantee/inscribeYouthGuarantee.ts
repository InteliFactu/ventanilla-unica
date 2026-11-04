import type { HttpClient } from '../../http/types/HttpClient'
import { downloadYouthGuaranteeReceipt } from './downloadYouthGuaranteeReceipt'
import { mapYouthGuaranteeInscriptionOptions } from './mappers/mapYouthGuaranteeInscriptionOptions'
import { mapYouthGuaranteePlan } from './mappers/mapYouthGuaranteePlan'
import { readYouthGuarantee } from './readYouthGuarantee'
import { submitYouthGuarantee } from './submitYouthGuarantee'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeInscriptionOptions } from './types/YouthGuaranteeInscriptionOptions'
import type { YouthGuaranteeWriteResult } from './types/YouthGuaranteeWriteResult'
import { validateYouthGuaranteeAnswers } from './validators/validateYouthGuaranteeAnswers'
import { validateYouthGuaranteeDeclarations } from './validators/validateYouthGuaranteeDeclarations'

export const inscribeYouthGuarantee = async (
  client: HttpClient,
  answers: YouthGuaranteeAnswers,
  confirmed: boolean,
  options: string | YouthGuaranteeInscriptionOptions = {},
): Promise<YouthGuaranteeWriteResult> => {
  const files = mapYouthGuaranteeInscriptionOptions(options)
  const out = files.out
  const current = await readYouthGuarantee(client, out)
  if (current.inscribed !== false)
    throw new Error(
      'Garantía Juvenil: inscription requires an explicitly unregistered holder; no inscription was submitted',
    )
  validateYouthGuaranteeAnswers(answers, current.form)
  const plan = mapYouthGuaranteePlan(current, answers)
  if (!confirmed) return plan
  validateYouthGuaranteeDeclarations(answers, current.form)
  const receipt = await submitYouthGuarantee(client, answers, confirmed, files)
  return downloadYouthGuaranteeReceipt(
    client,
    {
      ...plan,
      executed: true,
      notes: receipt.registered
        ? plan.notes
        : [
            ...plan.notes,
            'The portal did not prove registration. Complete any required signature in the portal before treating the holder as inscribed.',
          ],
      current,
      receipt,
    },
    out,
  )
}
