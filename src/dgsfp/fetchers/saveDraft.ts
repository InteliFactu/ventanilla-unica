import type { HttpClient } from '../../http/types/HttpClient'
import { callDgsfpService } from './callDgsfpService'

/** Save the form as the holder's draft (`guardarBorradorPresentacion`), as "Revisar y presentar" does before the review; the answer is the draft id. */
export const saveDraft = async (
  client: HttpClient,
  digest: string,
  draft: { readonly numTelematico: string; readonly datosFormulario: string },
): Promise<void> => {
  const id = await callDgsfpService(
    client,
    digest,
    'RestService.svc/guardarBorradorPresentacion',
    {
      datosFormulario: draft.datosFormulario,
      numTelematico: draft.numTelematico,
    },
  )
  if (typeof id !== 'number' || id <= 0)
    throw new Error('DGSFP: the sede did not save the draft')
}
