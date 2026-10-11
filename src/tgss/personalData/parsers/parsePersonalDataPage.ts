import { parseForms } from '../../../html/parsers/parseForms'
import { readBaseHref } from '../../session/parsers/readBaseHref'
import { mapImportassAddress } from '../mappers/mapImportassAddress'
import type { PersonalDataPage } from '../types/PersonalDataPage'
import { readDefinitionValue } from './readDefinitionValue'

/**
 * Read "Tus datos personales". The cards show the values; the hidden
 * "Modificar" modals are plain forms carrying the same values unformatted,
 * so the contact data and the domicile are read from the forms a change posts.
 */
export const parsePersonalDataPage = (
  html: string,
  pageUrl: string,
): PersonalDataPage => {
  const forms = parseForms(html, readBaseHref(html, pageUrl))
  const contactForm = forms.find((form) => 'telefonoMovil' in form.fields)
  const addressForm = forms.find((form) => 'nombreVia' in form.fields)
  if (!contactForm || !addressForm)
    throw new Error(
      'Importass: the datos personales page carries no edit forms',
    )
  const contact = (name: string): string => contactForm.fields[name] ?? ''
  return {
    data: {
      name: readDefinitionValue(html, /^Nombre$/),
      birthDate: readDefinitionValue(html, /^Fecha de nacimiento$/),
      identifier: readDefinitionValue(html, /^(DNI|NIE|Pasaporte)$/),
      naf: readDefinitionValue(html, /^Tu número de la Seg\. Social$/),
      landline: contact('telefonoFijo'),
      mobilePrefix: contact('prefijo'),
      mobile: contact('telefonoMovil'),
      email: contact('email'),
      address: mapImportassAddress(html, addressForm),
    },
    contactForm,
    addressForm,
  }
}
