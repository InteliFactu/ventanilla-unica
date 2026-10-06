import type { HttpClient } from '../../http/types/HttpClient'
import { bulkFilingUrls } from './bulkFilingUrls'
import { fetchErrorReport } from './fetchers/fetchErrorReport'
import { postTgvi } from './fetchers/postTgvi'
import { chunkRecords } from './mappers/chunkRecords'
import { parseErrorReport } from './parsers/parseErrorReport'
import { sendBlocks } from './sendBlocks'
import type { BulkFile } from './types/BulkFile'
import type { BulkValidation } from './types/BulkValidation'

/**
 * "Validar": InicializarEnvio with the type 1 record, EnviarDatos with the
 * rest, and the error report when a record fails. It opens an envío at the
 * AEAT but presents nothing; only the signature window's call does.
 */
export const runTgviValidation = async (
  client: HttpClient,
  file: BulkFile,
  periodo: string,
): Promise<BulkValidation> => {
  const blocks = chunkRecords(file.records)
  const start = await postTgvi(
    client,
    bulkFilingUrls.initialize,
    {
      modelo: file.modelo,
      ejercicio: file.ejercicio,
      periodo,
      ndc: file.nif,
      idioma: 'ES',
      numbloques: String(blocks.length),
      codificacion: 'UTF-8',
    },
    file.header,
  )
  if ((start.codigo !== 0 && start.codigo !== 8888) || !start.idEnvio)
    throw new Error(
      `TGVI: the declarant record was refused (${String(start.codigo)}: ${start.mensaje})`,
    )
  const end = await sendBlocks(client, start.idEnvio, blocks)
  const erroneos = end.erroneos ?? 0
  return {
    idEnvio: start.idEnvio,
    correctos: end.correctos ?? 0,
    erroneos,
    avisos: end.avisos,
    errores:
      erroneos === 0
        ? []
        : parseErrorReport(
            await fetchErrorReport(client, start.idEnvio),
            file.recordLength,
          ),
  }
}
