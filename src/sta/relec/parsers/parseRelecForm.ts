import { parseForms } from '../../../html/parsers/parseForms'
import { mapRelecForm } from '../mappers/mapRelecForm'
import type { RelecForm } from '../types/RelecForm'

/**
 * The TramitaForm page: its `TramitaSign` form inputs, the holder (the
 * certificate's natural person, in the identification inputs), the entities
 * it represents, the contact data and address its script prefills.
 */
export const parseRelecForm = (html: string, url: string): RelecForm => {
  const form = parseForms(html, url).find((candidate) =>
    candidate.action.endsWith('/Relec/TramitaSign'),
  )
  if (form === undefined)
    throw new Error(
      'TramitaForm carried no TramitaSign form; the sede did not open the procedure',
    )
  return mapRelecForm(html, form.fields)
}
