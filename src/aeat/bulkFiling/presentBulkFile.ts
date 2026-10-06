import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { fetchSignatureDialog } from './fetchers/fetchSignatureDialog'
import { postPresentation } from './fetchers/postPresentation'
import { mapBulkFilingPlan } from './mappers/mapBulkFilingPlan'
import { openTgviAs } from './openTgviAs'
import { readBulkFile } from './readBulkFile'
import { runTgviValidation } from './runTgviValidation'
import { saveBulkJustificante } from './saveBulkJustificante'
import type { BulkFilingQuery } from './types/BulkFilingQuery'
import type { BulkFilingReceipt } from './types/BulkFilingReceipt'
import { checkSignedHeader } from './validators/checkSignedHeader'

/**
 * `aeat informativa`: present an informative return file through TGVI Online.
 * Unconfirmed it validates every record at the AEAT, which opens an envío but
 * presents nothing. Confirmed it refuses any failing record (the window would
 * otherwise present only the valid ones), checks the record the window will
 * register against the file, and presents with the firma básica.
 */
export const presentBulkFile = async (
  client: HttpClient,
  query: BulkFilingQuery,
  context: {
    readonly confirmed: boolean
    readonly outDir?: string | undefined
  },
): Promise<WriteResult<BulkFilingReceipt>> => {
  const file = await readBulkFile(query.fichero)
  await openTgviAs(client, file)
  const validation = await runTgviValidation(client, file, query.periodo)
  const action = `aeat informativa ${file.modelo} ${file.ejercicio} ${file.nif}`
  const plan = mapBulkFilingPlan(file, validation)
  if (!context.confirmed)
    return {
      action,
      executed: false,
      plan,
      notes: ['Validated only; nothing is presented without --confirmar si.'],
    }
  if (validation.erroneos > 0)
    throw new Error(
      `TGVI: ${String(validation.erroneos)} records fail validation; nothing is filed`,
    )
  const dialog = await fetchSignatureDialog(client, validation.idEnvio)
  checkSignedHeader(file, dialog)
  const answer = await postPresentation(client, dialog)
  if (answer.codigo !== 0 || !answer.csv)
    throw new Error(
      `TGVI: presentation refused (${String(answer.codigo)}: ${answer.mensaje})`,
    )
  return {
    action,
    executed: true,
    plan,
    receipt: await saveBulkJustificante(
      client,
      file.modelo,
      answer.csv,
      context.outDir,
    ),
    notes: [`Signed as ${dialog.nif} ${dialog.nombre}.`],
  }
}
