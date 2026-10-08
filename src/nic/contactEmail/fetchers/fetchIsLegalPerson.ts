import type { HttpClient } from '../../../http/types/HttpClient'
import { nicBaseUrl } from '../../nicBaseUrl'

/** Whether the contact is a legal person, for whom Red.es also demands the NIF and the powers. */
export const fetchIsLegalPerson = async (
  client: HttpClient,
  identificador: string,
): Promise<boolean> => {
  const response = await client.request(
    `${nicBaseUrl}/peticion/esPersonaJuridica.action?identificador=${encodeURIComponent(identificador)}`,
  )
  return response.text.trim() === 'true'
}
