import type { ApplicationDocumentParties } from '../types/ApplicationDocumentParties'

/** A synthetic ROLECE application document (`campoXML`) with the parties the checks read. */
export const applicationDocumentXml = (
  parties: ApplicationDocumentParties,
): string =>
  `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?><?xml-stylesheet type="text/xsl" href="xsl/plantilla.xsl"?><rolece:RegistrationApplication id="root" xmlns:cac="urn:cac" xmlns:cbc="urn:cbc" xmlns:rolece="urn:rolece"><cac:CompetentInstitutionParty><cbc:RegistrationName>Secretaría General</cbc:RegistrationName></cac:CompetentInstitutionParty><cac:SenderParty><cac:PartyIdentification><cbc:ID schemeID="NIF" schemeVersionID="1.0">${parties.sender}</cbc:ID></cac:PartyIdentification></cac:SenderParty><cac:EconomicOperatorParty><cac:Party><cac:PartyIdentification><cbc:ID schemeID="NIF">${parties.nif}</cbc:ID></cac:PartyIdentification><cac:PostalAddress><cbc:CountrySubentityCode listID="ID-ROLECE">ES432</cbc:CountrySubentityCode></cac:PostalAddress></cac:Party></cac:EconomicOperatorParty><cac:NotificationParty><cac:Contact><cbc:ElectronicMail>${parties.email}</cbc:ElectronicMail></cac:Contact></cac:NotificationParty></rolece:RegistrationApplication>`
