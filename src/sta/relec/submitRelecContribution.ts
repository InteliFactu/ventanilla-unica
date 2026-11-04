import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { buildTramitaSignPairs } from './builders/buildTramitaSignPairs'
import { mapRelecContributionTargets } from './mappers/mapRelecContributionTargets'
import { selectRepresented } from './selectors/selectRepresented'
import { submitRelecFiling } from './submitRelecFiling'
import type { RelecPreparation } from './types/RelecPreparation'
import type { RelecReceipt } from './types/RelecReceipt'

/**
 * The confirmed half: attach and sign the PDFs, post the form ("Continuar"),
 * sign the registry form XML, register (`TramitaJustif`) and read the CSV
 * of the justificante from the answer. Only the last request is the act.
 */
export const submitRelecContribution = async (
  client: HttpClient,
  prepared: RelecPreparation,
  identity: CertificateIdentity,
): Promise<RelecReceipt> => {
  const { origin, form, formUrl, plan, types } = prepared
  const pairs = buildTramitaSignPairs(
    form,
    selectRepresented(form),
    plan,
    types[0]?.dboid ?? '',
  )
  return submitRelecFiling(
    client,
    { origin, formUrl, pairs, targets: mapRelecContributionTargets(prepared) },
    identity,
  )
}
