import type { SelectOption } from '../../../html/types/SelectOption'
import { mapRepresentedParty } from '../mappers/mapRepresentedParty'
import type { RelecRepresented } from '../types/RelecRepresented'

/**
 * One represented entity from its `changeRepresentado()` block: the `Rep*`
 * values `$("RepX").value='..'` and the person type it ticks in
 * `tipoPersonaRepresented` (`RJ` legal entity, `RF` natural person).
 */
export const parseRepresentedBlock = (
  block: string,
  option: SelectOption,
): RelecRepresented => {
  const fields = Object.fromEntries(
    [...block.matchAll(/\$\("(Rep\w+)"\)\.value='([^']*)'/g)].map(
      ([, name = '', value = '']) => [name, value],
    ),
  )
  const personType =
    /tipoPersonaRepresented'\],\s*"(R[FJ])"/.exec(block)?.[1] ?? 'RJ'
  return {
    dboid: option.value,
    personType,
    fields,
    ...mapRepresentedParty(fields, personType, option.label),
  }
}
