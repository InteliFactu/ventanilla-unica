import type { BillingPlace } from '../types/BillingPlace'
import type { NotaCompany } from '../types/NotaCompany'
import type { NotaQuery } from '../types/NotaQuery'
import type { NotaRepresentative } from '../types/NotaRepresentative'

/**
 * The identification form for a company requester resident in Spain, posted
 * once each: the page's Vue duplicates are dropped, and `viesNumber` is left
 * out (an empty one answers "VIES no válido"). Every e-mail field gets the
 * same address. Country 108 is Spain.
 */
export const mapIdentificationFields = (
  query: NotaQuery,
  company: NotaCompany,
  representative: NotaRepresentative,
  place: BillingPlace,
): Record<string, string> => {
  const billing = 'company.billingData'
  const person = 'company.representanteData.personIdentificationData'
  return {
    solicitanteType: 'COMPANY',
    spainResident: 'true',
    hasVies: 'false',
    irpfRetention: String(query.irpfRetention),
    'company.companyIdentificationData.documentType': 'NIF',
    'company.companyIdentificationData.documentNumber': query.nif,
    'company.companyIdentificationData.denomination': company.name,
    [`${billing}.documentType`]: 'NIF',
    [`${billing}.documentNumber`]: query.nif,
    [`${billing}.denomination`]: company.name,
    [`${billing}.countryCode`]: '108',
    [`${billing}.address`]: query.direccion ?? '',
    [`${billing}.postalCode`]: query.codigoPostal ?? '',
    [`${billing}.provinceCode`]: place.provinceCode,
    [`${billing}.townCode`]: place.townCode,
    'company.contactData.email': query.email,
    'company.contactData.phoneNumber': query.telefono,
    [`${person}.documentType`]: representative.documentType,
    [`${person}.documentNumber`]: representative.documentNumber,
    [`${person}.name`]: representative.name,
    [`${person}.primaryLastName`]: representative.primaryLastName,
    [`${person}.secondLastName`]: representative.secondLastName,
    'company.representanteData.contactData.email': query.email,
    'company.representanteData.contactData.phoneNumber': query.telefono,
  }
}
