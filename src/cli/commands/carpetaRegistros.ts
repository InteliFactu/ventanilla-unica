import { buildRegistryQuery } from '../../carpeta/registries/builders/buildRegistryQuery'
import { listRegistryEntries } from '../../carpeta/registries/listRegistryEntries'
import type { Command } from '../types/Command'

/** `ventanilla-unica carpeta registros [--desde d] [--hasta d] [--registro n]`: the holder's general-registry entries. */
export const carpetaRegistros: Command = {
  portal: 'carpeta',
  action: 'registros',
  description:
    'List the writs and requests the holder filed in the general registry (REGAGE and other SIR offices) as the state Carpeta Ciudadana shows them, with their state; --desde and --hasta DD/MM/AAAA (default the last 30 days), --registro filters one registry number',
  options: ['desde', 'hasta', 'registro'],
  run: async (client, options): Promise<unknown> =>
    listRegistryEntries(client, buildRegistryQuery(options, new Date())),
}
