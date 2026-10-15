import type { SignatureDetails } from '../types/SignatureDetails'

/** The stamp's default text: "Firmado por <CN>", the UTC date and the reason. */
export const defaultStampLines = (details: SignatureDetails): string[] => [
  `Firmado por ${details.commonName}`,
  `Fecha: ${details.date.toISOString().slice(0, 19).replace('T', ' ')} UTC`,
  ...(details.reason ? [`Motivo: ${details.reason}`] : []),
]
