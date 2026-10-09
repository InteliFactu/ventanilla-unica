import type { RelecForm } from '../types/RelecForm'
import type { RelecRepresented } from '../types/RelecRepresented'

/**
 * The entity the filing is made for: the first one the form offers, as its
 * own onload selects it. Only the representative flow was captured, so a
 * certificate that represents nobody is refused.
 */
export const selectRepresented = (form: RelecForm): RelecRepresented => {
  const [first] = form.represented
  if (first === undefined)
    throw new Error(
      'caceres aportar files as representative only (the captured flow); this certificate represents no entity at the sede',
    )
  return first
}
