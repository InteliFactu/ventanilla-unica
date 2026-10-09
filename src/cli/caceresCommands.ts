import { caceresDatosContacto } from './commands/caceresDatosContacto'
import { caceresExpedientes } from './commands/caceresExpedientes'
import { caceresNotificaciones } from './commands/caceresNotificaciones'
import { caceresRegistros } from './commands/caceresRegistros'
import type { Command } from './types/Command'

/** The Ayuntamiento de Cáceres sede commands: STA reads and the contact-data gate. */
export const caceresCommands: readonly Command[] = [
  caceresExpedientes,
  caceresNotificaciones,
  caceresRegistros,
  caceresDatosContacto,
]
