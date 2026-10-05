import type { DgsfpReceipt } from './types/DgsfpReceipt'
import type { DgsfpRegisterAnswer } from './types/DgsfpRegisterAnswer'
import { writeNamedPdf } from './writers/writeNamedPdf'

/** The receipt of a filing and, with `--out`, the justificante and the signed request document saved beside it. */
export const saveComplaintReceipt = async (
  answer: DgsfpRegisterAnswer,
  outDir: string | undefined,
): Promise<DgsfpReceipt> => {
  const receipt = {
    registryNumber: answer.numRegistro,
    registeredAt: answer.fechaRegistro,
    csv: answer.csv,
  }
  if (outDir === undefined) return receipt
  const saved = async (
    base64: string | undefined,
    name: string | undefined,
    fallback: string,
  ): Promise<string | undefined> =>
    base64 ? writeNamedPdf(outDir, name, fallback, base64) : undefined
  return {
    ...receipt,
    justificante: await saved(
      answer.justificanteRegistroB64,
      answer.nombreJustificante,
      `justificante-${answer.numRegistro}.pdf`,
    ),
    solicitud: await saved(
      answer.documentoSolicitudB64,
      answer.nombreDocumentoSolicitud,
      `solicitud-${answer.numRegistro}.pdf`,
    ),
  }
}
