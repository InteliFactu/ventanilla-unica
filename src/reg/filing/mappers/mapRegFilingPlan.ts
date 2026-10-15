import type { PreparedRegFiling } from '../types/PreparedRegFiling'
import type { RegFilingQuery } from '../types/RegFilingQuery'

/** What the confirmed run would file, line by line. */
export const mapRegFilingPlan = (
  query: RegFilingQuery,
  prepared: PreparedRegFiling,
): string[] => {
  const { holder } = prepared.session
  const { address } = prepared
  return [
    `Interesado: ${holder.nameUser} ${holder.familyNameUser} (${holder.docNumber}), in their own name`,
    `Domicilio: ${address.viaType.name} ${address.via}, ${address.zipCode} ${address.town.name} (${address.province.name})`,
    `Destino: ${prepared.organism.dsUtOrganic} (${prepared.organism.cdUtOrganic})`,
    `Asunto: ${query.subject}`,
    `Expone: ${query.exposes}`,
    `Solicita: ${query.request}`,
    ...prepared.pdfs.map(
      (pdf) => `Documento: ${pdf.name} (${String(pdf.content.length)} bytes)`,
    ),
    'Firma: XAdES detached SHA-512 of the entry summary with the holder certificate, then registry/signCertificate',
  ]
}
