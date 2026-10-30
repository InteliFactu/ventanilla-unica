/**
 * One apoderamiento row keyed by the column labels the page itself prints
 * ("Núm. Referencia", "NIF / CIF Apoderado", "Trámite", "Estado Actual",
 * "Fecha Baja", "Vigente"...), so a reordered or renamed column is never read
 * under the wrong name.
 */
export type AeatPower = Readonly<Record<string, string>>
