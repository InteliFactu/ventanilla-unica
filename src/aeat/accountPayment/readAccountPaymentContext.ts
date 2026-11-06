import { parseFirstForm } from '../../html/parsers/parseFirstForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { accountPaymentUrl } from './accountPaymentUrl'
import { fetchAccountPaymentForm } from './fetchers/fetchAccountPaymentForm'
import { fetchCollaboratingEntities } from './fetchers/fetchCollaboratingEntities'
import { postAccountPaymentForm } from './fetchers/postAccountPaymentForm'
import { findPaidNrc } from './findPaidNrc'
import { accountPaymentFirstForm } from './mappers/accountPaymentFirstForm'
import { parseCertificateHolder } from './parsers/parseCertificateHolder'
import { parseCollaboratingEntities } from './parsers/parseCollaboratingEntities'
import { parsePaymentAlerts } from './parsers/parsePaymentAlerts'
import type { AccountPaymentContext } from './types/AccountPaymentContext'
import type { AccountPaymentRequest } from './types/AccountPaymentRequest'

/**
 * Everything before the money moves: the adhered banks, the blank form, its
 * first step (which only validates and answers a summary or errors) and, for
 * the certificate's own NIF, MisPagos. A wrong name is replaced by the census
 * name of the NIF in the summary, so the holder's name is a safe default.
 */
export const readAccountPaymentContext = async (
  client: HttpClient,
  request: AccountPaymentRequest,
): Promise<AccountPaymentContext> => {
  const entities = parseCollaboratingEntities(
    await fetchCollaboratingEntities(client),
  )
  const page = await fetchAccountPaymentForm(client)
  const holder = parseCertificateHolder(page)
  const blank = parseFirstForm(page, accountPaymentUrl)
  if (!holder || !blank)
    throw new Error('AEAT: LiquidacionesCuenta printed no payment form')
  const step = await postAccountPaymentForm(
    client,
    accountPaymentFirstForm(blank, request, request.nombre ?? holder.nombre),
  )
  const alerts = parsePaymentAlerts(step)
  const paymentsChecked = holder.nif === request.nif
  return {
    holder,
    entities,
    alerts,
    summary:
      alerts.length > 0 ? undefined : parseFirstForm(step, accountPaymentUrl),
    paidNrc: paymentsChecked
      ? await findPaidNrc(client, request.justificante)
      : undefined,
    paymentsChecked,
  }
}
