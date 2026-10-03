import type { ApplicationParties } from '../types/ApplicationParties'

/** The operator, the expected signer, the notification address and the province of `campoXML`. */
export const readApplicationParties = (xml: string): ApplicationParties => {
  const patterns = {
    operatorNif:
      /<cac:EconomicOperatorParty>[\s\S]*?<cbc:ID schemeID="NIF">([^<]*)<\/cbc:ID>/,
    senderNif:
      /<cac:SenderParty>[\s\S]*?<cbc:ID schemeID="NIF"[^>]*>([^<]*)<\/cbc:ID>/,
    notificationEmail:
      /<cac:NotificationParty>[\s\S]*?<cbc:ElectronicMail>([^<]*)<\/cbc:ElectronicMail>/,
    province:
      /<cbc:CountrySubentityCode[^>]*>([^<]*)<\/cbc:CountrySubentityCode>/,
  } as const
  const read = (pattern: RegExp): string | undefined =>
    pattern.exec(xml)?.[1]?.trim()
  return {
    operatorNif: read(patterns.operatorNif),
    senderNif: read(patterns.senderNif),
    notificationEmail: read(patterns.notificationEmail),
    province: read(patterns.province),
  }
}
