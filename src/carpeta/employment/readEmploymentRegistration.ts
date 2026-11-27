import type { HttpClient } from '../../http/types/HttpClient'
import { parseDayDate } from '../registries/parsers/parseDayDate'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchEmploymentRegistration } from './fetchers/fetchEmploymentRegistration'
import { parseEmploymentRegistration } from './parsers/parseEmploymentRegistration'
import type { EmploymentRegistration } from './types/EmploymentRegistration'

export const readEmploymentRegistration = async (
  client: HttpClient,
  queriedDate?: string,
): Promise<EmploymentRegistration> => {
  const date =
    queriedDate === undefined
      ? undefined
      : parseDayDate(queriedDate, 'fecha')
          .toISOString()
          .slice(0, 10)
          .replaceAll('-', '')
  const token = await loginWithCertificate(client)
  return parseEmploymentRegistration(
    await fetchEmploymentRegistration(client, token, date),
  )
}
