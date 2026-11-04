import type { FormPair } from '../../../http/types/FormPair'
import type { RelecTramitePreparation } from '../types/RelecTramitePreparation'
import { buildAddressPairs } from './buildAddressPairs'
import { buildHolderPairs } from './buildHolderPairs'
import { buildRelecTramiteSlotPairs } from './buildRelecTramiteSlotPairs'

/** Own-name catalogue form: keep fixed-row metadata and replace only reviewed values. */
export const buildRelecTramitePairs = (
  prepared: RelecTramitePreparation,
): readonly FormPair[] => {
  const { form, plan, targets } = prepared
  const fields = Object.fromEntries(
    Object.entries(form.fields).filter(
      ([name]) =>
        !/^(?:Rep|RF|representados$|hasRepresentative$|tipoPersonaRepresentative$|tipoPersonaRepresented$)/.test(
          name,
        ),
    ),
  )
  return Object.entries({
    ...fields,
    ...Object.fromEntries(buildHolderPairs(form)),
    ...Object.fromEntries(buildAddressPairs('', form.address)),
    tipoActuacion: 'I',
    SELECTED_PERSON: form.fields['DBOIDPERS'] ?? '',
    OriginConsent: form.fields['OriginConsent'] || 'false',
    DinVarANNOT_TEXT_EXTRACT: plan.subject,
    modoNotificacion: 'E',
    contact21: plan.email ?? '',
    info21: 'on',
    contact1: plan.phone ?? '',
    ...(plan.phone ? { info1: 'on' } : {}),
    ...Object.fromEntries(buildRelecTramiteSlotPairs(targets)),
    lopdok: 'on',
  })
}
