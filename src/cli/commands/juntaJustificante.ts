import { downloadStaRegistryReceipt } from '../../sta/registry/downloadStaRegistryReceipt'
import type { Command } from '../types/Command'

export const juntaJustificante: Command = {
  portal: 'junta',
  action: 'justificante',
  description:
    'Save the justificante PDF of a Junta registry entry (--csv, --nif of the filer, --registro number) into --out',
  options: ['csv', 'nif', 'registro'],
  run: async (client, options): Promise<unknown> => {
    const csv = options['csv']?.trim()
    const nif = options['nif']?.trim().toUpperCase()
    const registryNumber = options['registro']?.trim()
    const outDir = options['out']
    if (!csv || !nif || !registryNumber || !outDir)
      throw new Error('--csv, --nif, --registro and --out are required')
    return downloadStaRegistryReceipt(client, 'junta', {
      csv,
      nif,
      registryNumber,
      outDir,
    })
  },
}
