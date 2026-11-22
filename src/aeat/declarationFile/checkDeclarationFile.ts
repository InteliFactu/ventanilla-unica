import type { HttpClient } from '../../http/types/HttpClient'
import { readDeclarationFile } from './fetchers/readDeclarationFile'
import type { DeclarationFileCheck } from './types/DeclarationFileCheck'

/**
 * Read a model file on the AEAT's own "Envío Fichero" page, as its holder or
 * an apoderado: the AEAT parses it and runs the model's checks (format and the
 * arithmetic between casillas) and answers with its errors and avisos table.
 * Firmar y enviar and Formalizar Ingreso / Devolución are never pressed, so
 * nothing is signed or filed. Only the 390 has been verified live.
 */
export const checkDeclarationFile = async (
  client: HttpClient,
  file: Buffer,
): Promise<DeclarationFileCheck> =>
  (await readDeclarationFile(client, file)).check
