import type { FilingDocument } from '../types/FilingDocument'
import type { FilingForm } from '../types/FilingForm'
import type { ProcedureFilingQuery } from '../types/ProcedureFilingQuery'
import { mapDocumentFilingPlan } from './mapDocumentFilingPlan'

/**
 * The plan of a writing under a trámite. The step-1 form shows the holder as
 * interesado until "en representación de terceros" is posted, so with a NIF
 * the plan names that NIF as interesado and the holder as representative.
 */
export const mapProcedureFilingPlan = (
  form: FilingForm,
  query: ProcedureFilingQuery,
  documents: readonly FilingDocument[],
): string[] =>
  mapDocumentFilingPlan(
    query.nif === undefined
      ? form
      : {
          ...form,
          interesado: {
            nif: query.nif,
            nombre: '(named at the signature step)',
          },
          representante: form.interesado,
        },
    query.subject,
    documents,
  )
