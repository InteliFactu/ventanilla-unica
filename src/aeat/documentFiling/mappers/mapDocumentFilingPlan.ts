import type { FilingDocument } from '../types/FilingDocument'
import type { FilingForm } from '../types/FilingForm'
import { partyLine } from './partyLine'

/** What the confirmed run files, in the registry's own terms, for the holder to read before `--confirmar si`. */
export const mapDocumentFilingPlan = (
  form: FilingForm,
  subject: string,
  documents: readonly FilingDocument[],
): string[] => [
  `Trámite: ${form.tramite}`,
  `Procedimiento: ${form.procedimiento}`,
  `Expediente: ${form.expediente}`,
  ...partyLine('Interesado', form.interesado),
  ...partyLine('Representante', form.representante),
  ...partyLine('Titular', form.titular),
  `Asunto: ${subject}`,
  ...documents.map(
    (document, index) =>
      `Documento ${String(index + 1)}: ${document.name} (tipo ${document.type}, ${String(document.content.length)} bytes)`,
  ),
  'Firma básica with the holder certificate; the registry stamps it as filed today.',
]
