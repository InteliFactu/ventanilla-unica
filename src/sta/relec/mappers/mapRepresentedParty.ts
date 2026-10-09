import type { RelecParty } from '../types/RelecParty'

/** Name and NIF of a represented entity from its `Rep*` values: company name and CIF for `RJ`, full name and NIF for `RF`. */
export const mapRepresentedParty = (
  fields: Readonly<Record<string, string>>,
  personType: string,
  label: string,
): RelecParty => {
  const value = (name: string): string => fields[name] ?? ''
  if (personType === 'RJ')
    return {
      name: value('RepRazonSoc') || label,
      nif: `${value('RepCIF')}${value('RepCIFCtrlDigit')}`,
    }
  return {
    name:
      [value('RepNombre'), value('RepApellido1'), value('RepApellido2')]
        .filter(Boolean)
        .join(' ') || label,
    nif: `${value('RepDocuNum')}${value('RepDigito')}`,
  }
}
