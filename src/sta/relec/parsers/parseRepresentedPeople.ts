import { readSelectOptions } from '../../../html/parsers/readSelectOptions'
import type { RelecRepresented } from '../types/RelecRepresented'
import { parseRepresentedBlock } from './parseRepresentedBlock'

/**
 * The entities the holder represents: `representados` lists their dboids,
 * and `changeRepresentado()` fills each one's fields in a block
 * `if(codigoRepresentado=='<dboid>NEW' || ...)` that ends setting
 * `SELECTED_PERSON`. An option without such a block is skipped.
 */
export const parseRepresentedPeople = (
  html: string,
): readonly RelecRepresented[] =>
  readSelectOptions(html, 'representados')
    .filter((option) => /^\d+$/.test(option.value))
    .flatMap((option) => {
      const start = html.indexOf(`codigoRepresentado=='${option.value}NEW'`)
      const end = html.indexOf("$('SELECTED_PERSON').value", start)
      return start === -1 || end === -1
        ? []
        : [parseRepresentedBlock(html.slice(start, end), option)]
    })
