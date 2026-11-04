import { htmlToText } from '../../../html/htmlToText'
import type { YouthGuaranteeReceipt } from '../types/YouthGuaranteeReceipt'
import { isYouthGuaranteeRegistryNumber } from '../validators/isYouthGuaranteeRegistryNumber'
import { readYouthGuaranteeDocuments } from './readYouthGuaranteeDocuments'

/** HTTP 200 and a draft or signature page do not prove a filed inscription. */
export const readYouthGuaranteeReceipt = (
  html: string,
): YouthGuaranteeReceipt => {
  const responseText = htmlToText(html.replaceAll(/<!--[\s\S]*?-->/g, ''))
  const candidate =
    /N[uú]mero de registro\s*:\s*([\w/-]+)/i.exec(responseText)?.[1] ?? null
  const registrationNumber =
    candidate && isYouthGuaranteeRegistryNumber(candidate) ? candidate : null
  const confirmed =
    /solicitud (?:se ha |ha sido )?(?:registrada|presentada)(?: correctamente| con [eé]xito)?/i.test(
      responseText,
    )
  return {
    registrationNumber,
    registered: registrationNumber !== null && confirmed,
    responseText,
    documents: readYouthGuaranteeDocuments(html),
  }
}
