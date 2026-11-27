import type { EmploymentRegistration } from '../types/EmploymentRegistration'
import { readEmploymentRegistrationData } from './readEmploymentRegistrationData'

export const parseEmploymentRegistration = (
  text: string,
): EmploymentRegistration => {
  const { inscrito, fechaInscrito } = readEmploymentRegistrationData(text)
  if (inscrito === 'N') return { registered: false, registeredSince: null }
  if (inscrito !== 'S')
    throw new Error('Carpeta: unrecognized employment registration status')

  // Preserve the date in the provider's local timestamp without converting it
  // to UTC, which could move midnight back a day.
  const registeredSince =
    typeof fechaInscrito === 'string'
      ? (/^\d{4}-\d{2}-\d{2}(?=T|$)/.exec(fechaInscrito)?.[0] ?? null)
      : null
  return { registered: true, registeredSince }
}
