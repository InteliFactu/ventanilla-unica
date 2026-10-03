import { readApplicationParties } from '../parsers/readApplicationParties'

/**
 * Refuse unless the signing certificate is the one the portal expects to sign
 * (the document's sender, the person logged in) and represents the operator:
 * a representative certificate names both NIFs in its subject.
 */
export const assertSignerRepresents = (
  document: string,
  signer: string,
  operatorNif: string,
): void => {
  const { senderNif } = readApplicationParties(document)
  if (
    !senderNif ||
    !signer.includes(senderNif) ||
    !signer.includes(operatorNif)
  )
    throw new Error(
      `ROLECE: the certificate ${signer} is not ${senderNif ?? 'the sender'} acting for ${operatorNif}; nothing was signed`,
    )
}
