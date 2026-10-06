import type { DocumentFilingQuery } from '../types/DocumentFilingQuery'

/**
 * What `firmaryEnviar` posts to reach step 2: the second form with every
 * step-1 value copied into its `<name>Avanzar` twin. The confirmation fields
 * repeat the contact data, as the page checks they match.
 */
export const signatureScreenFields = (
  form: Readonly<Record<string, string>>,
  form2: Readonly<Record<string, string>>,
  query: DocumentFilingQuery,
): Record<string, string> => {
  const copied = [
    'fCSV',
    'fNCC',
    'fOficinaGestoraNCC',
    'fUnidadTrabajoNCC',
    'fCarpetaGN',
    'fNifTitular',
  ].map((name): [string, string] => [`${name}Avanzar`, form[name] ?? ''])
  return {
    ...form2,
    ...Object.fromEntries(copied),
    pAccionForm2: '2',
    fTramiteAvanzar: form['fTramite'] ?? '',
    fOcurrenciaAvanzar: form['fOcurrencia'] ?? '',
    fNifAvanzar: form['fNif'] ?? '',
    fExpedienteAvanzar: form['fExpediente'] ?? '',
    fTextoAvanzar: '',
    fAsuntoAvanzar: query.subject,
    fTelefonoContactoAvanzar: query.phone,
    fTelefonoContactoConfAvanzar: query.phone,
    fCorreoContactoAvanzar: query.email ?? '',
    fCorreoContactoConfAvanzar: query.email ?? '',
  }
}
