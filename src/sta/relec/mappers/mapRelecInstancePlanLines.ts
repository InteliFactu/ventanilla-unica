import type { RelecInstancePlan } from '../types/RelecInstancePlan'

/** The plan as the lines every write command prints. */
export const mapRelecInstancePlanLines = (
  plan: RelecInstancePlan,
): readonly string[] => [
  `File "${plan.procedure}" at ${plan.host}: ${plan.subject}`,
  plan.represented === undefined
    ? `As ${plan.filer.name} (${plan.filer.nif}), in their own name`
    : `As ${plan.filer.name} (${plan.filer.nif}), representing ${plan.represented.name} (${plan.represented.nif})`,
  ...plan.documents.map(
    (document, index) =>
      `Attach and sign ${String(index + 1)}: ${document.name} (${String(document.bytes)} bytes, sha256 ${document.sha256}) in row "${document.slot.name}"`,
  ),
  ...(plan.missingRequired.length === 0
    ? []
    : [`Missing required rows: ${plan.missingRequired.join(', ')}`]),
  `Electronic notification, notice to ${plan.email ?? '(no e-mail: pass --correo)'}${plan.phone ? `, phone ${plan.phone}` : ''}`,
  'Then sign the registry form (XAdES) and register it (TramitaJustif)',
]
