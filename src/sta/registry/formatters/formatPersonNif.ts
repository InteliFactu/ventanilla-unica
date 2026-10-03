import type { RegistryPerson } from '../types/RegistryPerson'

/** The NIF as the sede prints it: the stored `idnumber` loses the padding zero of a DNI, plus the control letter. */
export const formatPersonNif = (person: RegistryPerson): string =>
  `${person.idnumber.replace(/^0(?=\d{8}$)/, '')}${person.ctrldigit}`
