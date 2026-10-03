import type { SubmittedDocument } from '../../tgss/attachments/types/SubmittedDocument'

/** Every step `rolece solicitud` would take after the read-only screens, with the exact values. */
export const mapRegistrationPlan = (
  action: string,
  fields: Readonly<Record<string, string>>,
  documents: readonly SubmittedDocument[],
): readonly string[] => [
  `POST ${action} with:`,
  ...Object.entries(fields).map(([name, value]) => `  ${name} = ${value}`),
  'The portal answers the summary of the application ("documento de Solicitud") to sign; sign it with the certificate holder as representative (Autofirma in the browser).',
  'The portal answers the justificante (acuse de recibo) of the application: download it with "Descargar el Justificante Electrónico" and keep it, pliegos accept it as proof.',
  ...documents.map(
    (document) =>
      `Not attached: ${document.fileName} (${String(document.bytes)} bytes). The Solicitud Simplificada has no upload; ROLECE inscribes what the Registro Mercantil's nota registral says.`,
  ),
  'Within 10 days of filing, ask the Registro Mercantil (registradores.org) to e-mail the nota registral of the company to notasregistrales@patrimoniodelestado.es; ROLECE starts processing when it arrives.',
]
