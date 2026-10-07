import type { HttpClient } from '../../http/types/HttpClient'
import { readXmlMessages } from '../prosa/parsers/readXmlMessages'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { parseEmployerAccounts } from './parsers/parseEmployerAccounts'
import type { EmployerAccountsResult } from './types/EmployerAccountsResult'

/**
 * List the holder's códigos de cuenta de cotización with their situation
 * (alta or baja and since when) from the Sistema RED "consulta de
 * autorizados" (RETC0001), which opens on that list for a company
 * certificate. It answers whether an employer account is still open.
 */
export const readEmployerAccounts = async (
  client: HttpClient,
): Promise<EmployerAccountsResult> => {
  const session = await loginWithCertificate(client, 'RETC0001')
  const accounts = parseEmployerAccounts(session.xml)
  const titular =
    /<fila1Dinamica[^>]*>([^<]*)<\/fila1Dinamica>/
      .exec(session.xml)?.[1]
      ?.trim() ?? ''
  const notes = [
    'RETC0001 lists the accounts that have, or had, a RED authorisation; an account never managed through RED may not appear',
    ...readXmlMessages(session.xml),
  ]
  return { titular, accounts, notes }
}
