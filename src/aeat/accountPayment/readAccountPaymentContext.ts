import type { HttpClient } from '../../http/types/HttpClient'
import { fetchAccountPaymentForm } from './fetchers/fetchAccountPaymentForm'
import { fetchCollaboratingEntities } from './fetchers/fetchCollaboratingEntities'
import { findPaidNrc } from './findPaidNrc'
import { accountPaymentFirstForm } from './mappers/accountPaymentFirstForm'
import { openObligadoPaymentSession } from './openObligadoPaymentSession'
import { parseCollaboratingEntities } from './parsers/parseCollaboratingEntities'
import { parseInitialAccountPaymentForm } from './parsers/parseInitialAccountPaymentForm'
import { readAccountPaymentStep } from './readAccountPaymentStep'
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
  const { holder, blank } = parseInitialAccountPaymentForm(
    await fetchAccountPaymentForm(client),
  )
  const ownPayment = holder.nif === request.nif
  const otherClient = ownPayment ? undefined : obligadoClient
  const paidNrc = otherClient
    ? await findPaidNrc(
        await openObligadoPaymentSession(otherClient, request.nif),
        request.justificante,
      )
    : undefined
  if (paidNrc) return { entities, alerts: [], paidNrc, paymentsChecked: true }

  const step = await readAccountPaymentStep(
    client,
    accountPaymentFirstForm(blank, request, request.nombre ?? holder.nombre),
  )
  return {
    entities,
    ...step,
    paidNrc: ownPayment
      ? await findPaidNrc(client, request.justificante)
      : undefined,
    paymentsChecked: ownPayment || otherClient !== undefined,
  }
}
