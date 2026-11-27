import type { EmploymentRegistrationData } from '../types/EmploymentRegistrationData'
import type { EmploymentRegistrationResponse } from '../types/EmploymentRegistrationResponse'

export const readEmploymentRegistrationData = (
  text: string,
): EmploymentRegistrationData => {
  let response: EmploymentRegistrationResponse | null
  try {
    response = JSON.parse(text) as EmploymentRegistrationResponse | null
  } catch {
    throw new Error('Carpeta: the employment response is not valid JSON')
  }

  const registration = response?.datosInscripcion
  const code = registration?.codigoRespuesta?.codRespuesta
  if (!registration || (code !== 0 && code !== '0'))
    throw new Error(
      'Carpeta: the provider did not confirm employment registration',
    )
  return registration
}
