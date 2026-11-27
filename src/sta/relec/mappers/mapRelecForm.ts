import { readSelectOptions } from '../../../html/parsers/readSelectOptions'
import { parseContactDefaults } from '../parsers/parseContactDefaults'
import { parseHolderAddress } from '../parsers/parseHolderAddress'
import { parseRepresentedPeople } from '../parsers/parseRepresentedPeople'
import type { RelecForm } from '../types/RelecForm'

/** Map the selected signing form's fields and the page's contact details. */
export const mapRelecForm = (
  html: string,
  fields: Readonly<Record<string, string>>,
): RelecForm => ({
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
})
