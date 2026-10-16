import type { HttpClient } from '../../../http/types/HttpClient'
import { mapSearchFields } from '../mappers/mapSearchFields'
import { readAccountsDepositAvailable } from '../parsers/readAccountsDepositAvailable'
import { readCompanyRows } from '../parsers/readCompanyRows'
import { selectCompany } from '../selectors/selectCompany'
import type { CompanyChoice } from '../types/CompanyChoice'
import { assertNotaPage } from '../validators/assertNotaPage'
import { postNotaStep } from './postNotaStep'

/**
 * Search the Registro Mercantil by NIF (the page's reCAPTCHA is not checked
 * for certificate users) and select the company; the tipos-informacion page
 * that follows says whether its accounts deposit is available.
 */
export const chooseCompany = async (
  client: HttpClient,
  csrf: string,
  nif: string,
): Promise<CompanyChoice> => {
  const search = mapSearchFields(nif)
  const results = await postNotaStep(
    client,
    'certificado/mercantil/busqueda/sociedad',
    csrf,
    search,
  )
  const company = selectCompany(readCompanyRows(results.text), nif)
  const types = await postNotaStep(
    client,
    'certificado/mercantil/busqueda/tipos-informacion',
    csrf,
    { ...search, selectedDocumentId: company.documentId },
  )
  assertNotaPage(
    types,
    'MERC_INFORMACION_GENERAL_MERCANTIL',
    'selecting the company',
  )
  return {
    company,
    accountsDepositAvailable: readAccountsDepositAvailable(types.text),
  }
}
