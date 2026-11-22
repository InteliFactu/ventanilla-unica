import { htmlToText } from '../../../html/htmlToText'
import { readFilingParty } from '../parsers/readFilingParty'
import type { SignatureScreen } from '../types/SignatureScreen'

/** Filing for a third party, the signature step must name exactly that NIF as interesado; otherwise nothing is signed. */
export const assertSignatureInteresado = (
  screen: SignatureScreen,
  nif: string,
): void => {
  const shown = readFilingParty(htmlToText(screen.page.html), 'Interesado')
  if (shown?.nif !== nif)
    throw new Error(
      `AEAT: the signature step names ${shown?.nif ?? 'no interesado'} instead of ${nif}; nothing is filed`,
    )
}
