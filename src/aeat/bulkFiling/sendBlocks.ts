import type { HttpClient } from '../../http/types/HttpClient'
import { bulkFilingUrls } from './bulkFilingUrls'
import { postTgvi } from './fetchers/postTgvi'
import type { TgviAnswer } from './types/TgviAnswer'

/** EnviarDatos block by block; the last answer carries the validation totals. */
export const sendBlocks = async (
  client: HttpClient,
  idEnvio: string,
  blocks: readonly string[],
): Promise<TgviAnswer> => {
  let answer: TgviAnswer | undefined
  for (const [index, block] of blocks.entries()) {
    const numero = index + 1
    answer = await postTgvi(
      client,
      bulkFilingUrls.send,
      { idenvio: idEnvio, numbloque: String(numero), codificacion: 'UTF-8' },
      block,
    )
    const next = answer.codigo === 2004 && answer.siguienteBloque === numero + 1
    if (answer.codigo !== 0 && !next)
      throw new Error(
        `TGVI: block ${String(numero)} refused (${String(answer.codigo)}: ${answer.mensaje})`,
      )
  }
  if (!answer) throw new Error('TGVI: the file has no type 2 records')
  return answer
}
