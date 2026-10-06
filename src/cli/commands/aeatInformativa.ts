import { presentBulkFile } from '../../aeat/bulkFiling/presentBulkFile'
import { validateBulkFilingOptions } from '../../aeat/bulkFiling/validators/validateBulkFilingOptions'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const aeatInformativa: Command = {
  portal: 'aeat',
  action: 'informativa',
  description:
    "Present an informative return file in the BOE design (190, 347, 180...) through TGVI Online, for its declarant (switching the represented holder when the certificate's holder differs): --fichero f.txt [--periodo 0A]. Without --confirmar si it validates every record at the AEAT and lists the failures, presenting nothing; confirmed, it refuses any failing record, signs with the firma básica and saves the justificante with --out",
  options: ['fichero', 'periodo'],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    presentBulkFile(client, validateBulkFilingOptions(options), {
      confirmed: isConfirmed(options),
      outDir: options['out'],
    }),
}
