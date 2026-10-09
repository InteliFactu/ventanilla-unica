import type { FormPair } from '../../../http/types/FormPair'
import type { RelecForm } from '../types/RelecForm'
import type { RelecPlan } from '../types/RelecPlan'
import type { RelecRepresented } from '../types/RelecRepresented'
import { buildAddressPairs } from './buildAddressPairs'
import { buildDocumentPairs } from './buildDocumentPairs'
import { buildHeadPairs } from './buildHeadPairs'
import { buildHolderPairs } from './buildHolderPairs'
import { buildRepresentationPairs } from './buildRepresentationPairs'

/**
 * The "Continuar" submission (`POST /sta/Relec/TramitaSign`), field by field
 * in the order the browser posted it on 2026-10-09: representation,
 * holder, electronic notification with its contact ways, address, the free
 * contribution (`aportadoc_modo=libre`) with its reference, the document
 * rows, and the data-protection tick.
 */
export const buildTramitaSignPairs = (
  form: RelecForm,
  represented: RelecRepresented,
  plan: RelecPlan,
  defaultType: string,
): readonly FormPair[] => [
  ...buildHeadPairs(form, represented.dboid),
  ...buildRepresentationPairs(represented),
  ...buildAddressPairs('Representado', {
    id: 'new',
    fields: { tipoVia: form.defaultStreetType },
  }),
  ...buildHolderPairs(form),
  ['modoNotificacion', 'E'],
  ['contact21', plan.email],
  ['info21', 'on'],
  ...buildAddressPairs('', form.address),
  ['dboid1', ''],
  ['contact1', plan.phone ?? ''],
  ...(plan.phone ? [['info1', 'on'] as const] : []),
  ['aportadoc_modo', 'libre'],
  ['cod_requerimiento', ''],
  ['referenciaAporDoc', plan.reference],
  ['infoApordoc', plan.information],
  ...buildDocumentPairs(plan.documents, represented.dboid, defaultType),
  ['lopdok', 'on'],
]
