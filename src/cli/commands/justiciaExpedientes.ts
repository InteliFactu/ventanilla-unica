import { listJusticiaExpedientes } from '../../justicia/expedientes/listJusticiaExpedientes'
import type { Command } from '../types/Command'

/** `ventanilla-unica justicia expedientes`: the holder's judicial expedientes. */
export const justiciaExpedientes: Command = {
  portal: 'justicia',
  action: 'expedientes',
  description:
    "List the holder's judicial expedientes in the Carpeta Justicia (procedimiento, órgano, estado, NIG) through Cl@ve with the certificate",
  options: [],
  run: async (client): Promise<unknown> => listJusticiaExpedientes(client),
}
