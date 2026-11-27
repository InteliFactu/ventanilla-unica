import { parseFirstForm } from '../../html/parsers/parseFirstForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { accountPaymentUrl } from './accountPaymentUrl'
import { fetchAccountPaymentForm } from './fetchers/fetchAccountPaymentForm'
import { fetchCollaboratingEntities } from './fetchers/fetchCollaboratingEntities'
import { postAccountPaymentForm } from './fetchers/postAccountPaymentForm'
import { findPaidNrc } from './findPaidNrc'
import { accountPaymentFirstForm } from './mappers/accountPaymentFirstForm'
import { openObligadoPaymentSession } from './openObligadoPaymentSession'
import { parseCertificateHolder } from './parsers/parseCertificateHolder'
import { parseCollaboratingEntities } from './parsers/parseCollaboratingEntities'
import { parsePaymentAlerts } from './parsers/parsePaymentAlerts'
import type { AccountPaymentContext } from './types/AccountPaymentContext'
import type { AccountPaymentRequest } from './types/AccountPaymentRequest'

/**
 * Everything before the money moves: the adhered banks, the blank form, its
 * first step (which only validates and answers a summary or errors) and the
 * obligado's own MisPagos history. A wrong name is replaced by the census
 * name of the NIF in the summary, so the holder's name is a safe default.
 */
export const readAccountPaymentContext = async (
  client: HttpClient,
  request: AccountPaymentRequest,
  obligadoClient?: HttpClient,
): Promise<AccountPaymentContext> => {
  const entities = parseCollaboratingEntities(
    await fetchCollaboratingEntities(client),
  )
  const page = await fetchAccountPaymentForm(client)
  const holder = parseCertificateHolder(page)
  const blank = parseFirstForm(page, accountPaymentUrl)
  if (
    !holder ||
    blank?.action !== accountPaymentUrl ||
    blank.fields['fAccion'] !== '1'
  )
    throw new Error(
      'AEAT: expected the initial payment form; no payment was sent',
    )
  const step = await postAccountPaymentForm(
    client,
    accountPaymentFirstForm(blank, request, request.nombre ?? holder.nombre),
  )
  const alerts = parsePaymentAlerts(step)
  const paymentsClient =
    holder.nif === request.nif
      ? client
      : obligadoClient &&
        (await openObligadoPaymentSession(obligadoClient, request.nif))
  return {
    entities,
    alerts,
    summary:
      alerts.length > 0 ? undefined : parseFirstForm(step, accountPaymentUrl),
    paidNrc: paymentsClient
      ? await findPaidNrc(paymentsClient, request.justificante)
      : undefined,
    paymentsChecked: paymentsClient !== undefined,
  }
}
