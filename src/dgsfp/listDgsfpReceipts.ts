import { certificateNifs } from '../certificate/certificateNifs'
import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import type { HttpClient } from '../http/types/HttpClient'
import { fetchDgsfpReceiptList } from './fetchers/fetchDgsfpReceiptList'
import { openDgsfpSession } from './session/openDgsfpSession'
import type { DgsfpReceiptEntry } from './types/DgsfpReceiptEntry'

export const listDgsfpReceipts = async (
  client: HttpClient,
  identity: CertificateIdentity,
  registryNumber?: string,
): Promise<readonly DgsfpReceiptEntry[]> => {
  const { holder } = await openDgsfpSession(client)
  const holderNif = holder.identificador.trim().toUpperCase()
  if (!certificateNifs(identity).includes(holderNif))
    throw new Error(
      'DGSFP: the authenticated holder does not match the certificate',
    )

  const receipts = await fetchDgsfpReceiptList(client)
  const expected = registryNumber?.trim().toUpperCase()
  return expected === undefined
    ? receipts
    : receipts.filter(
        (receipt) => receipt.registryNumber.toUpperCase() === expected,
      )
}
