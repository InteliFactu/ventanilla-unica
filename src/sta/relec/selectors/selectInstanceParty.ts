import type { RelecForm } from '../types/RelecForm'
import type { RelecParty } from '../types/RelecParty'

/** The entity named by `--representado`, among those the form offers; undefined when the holder files in their own name. */
export const selectInstanceParty = (
  form: RelecForm,
  nif: string | undefined,
): RelecParty | undefined => {
  if (nif === undefined) return undefined
  const party = form.represented.find((candidate) => candidate.nif === nif)
  if (party === undefined)
    throw new Error(
      `--representado ${nif} is not offered by the form; it offers: ${form.represented.map((candidate) => candidate.nif).join(', ') || 'none'}`,
    )
  return { name: party.name, nif: party.nif }
}
