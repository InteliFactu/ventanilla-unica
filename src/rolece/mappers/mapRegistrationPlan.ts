import { createHash } from 'node:crypto'

import type { SubmittedDocument } from '../../tgss/attachments/types/SubmittedDocument'
import type { PreparedApplication } from '../types/PreparedApplication'

/** Every step `rolece solicitud` takes, with the exact values and the document it signs. */
export const mapRegistrationPlan = (
  prepared: PreparedApplication,
  documents: readonly SubmittedDocument[],
): readonly string[] => {
  const { application, screen, signed } = prepared
  const fieldLines = (fields: Readonly<Record<string, string>>): string[] =>
    Object.entries(fields)
      .filter(([name]) => name !== 'campoXML')
      .map(([name, value]) => `  ${name} = ${value}`)
  return [
    `Posted (files nothing, answers the unsigned draft): POST ${application.action} with:`,
    ...fieldLines(application.fields),
    'Document to sign (campoXML, ISO-8859-1):',
    `  ${screen.document}`,
    `  SHA-256 of its bytes: ${createHash('sha256').update(Buffer.from(screen.document, 'latin1')).digest('hex')}`,
    `Signature, as the screen asks AutoFirma: XAdES-BES enveloped inside the node id="root" (Reference URI="#root", enveloped-signature + C14N), SHA256withRSA, KeyInfo with the certificate and RSAKeyValue; signer ${signed.signer}; ${String(signed.xml.length)} bytes signed XML.`,
    `To file: POST ${screen.action} (ISO-8859-1 form) with:`,
    ...fieldLines(screen.fields).filter(
      (line) => !/^ {2}(?:firma|xmlFirmado) =/.test(line),
    ),
    '  firma = <base64 of the signed XML>',
    '  xmlFirmado = <the signed XML bytes>',
    'The portal answers the acuse de recibo (Número de Registro, Número de Expediente); the page, the signed XML and the justificante electrónico ("Descargar el Justificante Electrónico", a ZIP of the signed proof) are saved under --out.',
    ...documents.map(
      (document) =>
        `Not attached: ${document.fileName} (${String(document.bytes)} bytes). The Solicitud Simplificada has no upload; ROLECE inscribes what the Registro Mercantil's nota registral says.`,
    ),
    'Within 10 days of filing, ask the Registro Mercantil (registradores.org) to e-mail the nota registral of the company to notasregistrales@patrimoniodelestado.es; ROLECE starts processing when it arrives.',
  ]
}
