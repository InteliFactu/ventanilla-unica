import type { RelecPlan } from '../types/RelecPlan'

/** The plan as the lines every write command prints. */
export const mapRelecPlanLines = (plan: RelecPlan): readonly string[] => [
  `File "${plan.procedure}" at ${plan.host} for reference ${plan.reference}`,
  `As ${plan.representative.name} (${plan.representative.nif}), representing ${plan.represented.name} (${plan.represented.nif})`,
  ...(plan.information === ''
    ? []
    : [`Additional information: ${plan.information}`]),
  ...plan.documents.map(
    (document, index) =>
      `Attach and sign ${String(index + 1)}: ${document.uploadName} (${String(document.bytes)} bytes, sha256 ${document.sha256}) as ${document.typeCode}, "${document.description}"`,
  ),
  `Electronic notification, notice to ${plan.email}${plan.phone ? `, phone ${plan.phone}` : ''}`,
  'Then sign the registry form (XAdES) and register it (TramitaJustif)',
]
