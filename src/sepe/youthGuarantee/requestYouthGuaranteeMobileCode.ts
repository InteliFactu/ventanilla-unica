import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { assertEmptyYouthGuaranteeFile } from './fetchers/assertEmptyYouthGuaranteeFile'
import { postYouthGuaranteeAction } from './fetchers/postYouthGuaranteeAction'
import { waitForYouthGuaranteeFile } from './fetchers/waitForYouthGuaranteeFile'
import { mapYouthGuaranteeVerification } from './mappers/mapYouthGuaranteeVerification'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeMobileCode } from './types/YouthGuaranteeMobileCode'

export const requestYouthGuaranteeMobileCode = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  pinFile: string,
): Promise<YouthGuaranteeMobileCode> => {
  await assertEmptyYouthGuaranteeFile(pinFile, 'pin')
  const requested = await postYouthGuaranteeAction(
    client,
    page,
    mapYouthGuaranteeVerification(page, answers, 'confirmarMovil'),
    'mobile SMS request',
  )
  process.stderr.write(
    'Garantía Juvenil: SMS requested (valid for 4 hours). Write only the received code (letters and digits) to --pin-fichero; waiting up to 30 minutes.\n',
  )
  return {
    page: requested,
    pin: await waitForYouthGuaranteeFile(pinFile, 'pin'),
  }
}
