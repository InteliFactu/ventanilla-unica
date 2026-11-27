import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import type { HttpClient } from '../http/types/HttpClient'
import { fetchDgsfpReceiptList } from './fetchers/fetchDgsfpReceiptList'
import { openDgsfpSession } from './session/openDgsfpSession'
import type { DgsfpReceiptEntry } from './types/DgsfpReceiptEntry'
import { assertDgsfpCertificateHolder } from './validators/assertDgsfpCertificateHolder'

export const listDgsfpReceipts = async (
  client: HttpClient,
  identity: CertificateIdentity,
  registryNumber?: string,
): Promise<readonly DgsfpReceiptEntry[]> => {
  const { holder } = await openDgsfpSession(client)
  assertDgsfpCertificateHolder(identity, holder)

  const receipts = await fetchDgsfpReceiptList(client)
  const expected = registryNumber?.trim().toUpperCase()
  return expected === undefined
    ? receipts
    : receipts.filter(
        (receipt) => receipt.registryNumber.toUpperCase() === expected,
      )
}
