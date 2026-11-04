import type { RelecTramitePlan } from '../types/RelecTramitePlan'

/** Enforce complete, one-PDF-per-slot coverage before any write request. */
export const assertRelecTramitePlan = (plan: RelecTramitePlan): void => {
  if (plan.missingRequired.length > 0)
    throw new Error(
      `Missing required slots: ${plan.missingRequired.join('; ')}`,
    )
  const slots = plan.documents.map((document) => document.slot.dboid)
  if (new Set(slots).size !== slots.length)
    throw new Error('caceres tramite requires exactly one PDF per slot')
  if (!plan.filer.nif || !plan.filer.name)
    throw new Error('the form carries no holder identity; nothing was prepared')
}
