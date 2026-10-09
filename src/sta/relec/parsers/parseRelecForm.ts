import { parseForms } from '../../../html/parsers/parseForms'
import { readSelectOptions } from '../../../html/parsers/readSelectOptions'
import type { RelecForm } from '../types/RelecForm'
import { parseContactDefaults } from './parseContactDefaults'
import { parseHolderAddress } from './parseHolderAddress'
import { parseRepresentedPeople } from './parseRepresentedPeople'

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
  const { fields } = form
  return {
    fields,
    holder: {
      name: [fields['nombre'], fields['apellido1'], fields['apellido2']]
        .filter(Boolean)
        .join(' '),
      nif: `${fields['docuNum'] ?? ''}${fields['ctrlDigit'] ?? ''}`,
    },
    represented: parseRepresentedPeople(html),
    contact: parseContactDefaults(html),
    address: parseHolderAddress(html),
    defaultStreetType:
      readSelectOptions(html, 'RepresentadotipoVia')[0]?.value ?? '',
  }
}
