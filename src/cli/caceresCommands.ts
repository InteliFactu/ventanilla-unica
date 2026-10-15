import { caceresAportar } from './commands/caceresAportar'
import { caceresDatosContacto } from './commands/caceresDatosContacto'
import { caceresDatosPersonales } from './commands/caceresDatosPersonales'
import { caceresExpedientes } from './commands/caceresExpedientes'
import { caceresInstancia } from './commands/caceresInstancia'
import { caceresNotificaciones } from './commands/caceresNotificaciones'
import { caceresPadron } from './commands/caceresPadron'
import { caceresProcedimiento } from './commands/caceresProcedimiento'
import { caceresRegistros } from './commands/caceresRegistros'
import type { Command } from './types/Command'

/** The Ayuntamiento de Cáceres sede commands: STA reads, Relec procedure forms, the contact-data gate and the Relec contribution. */
export const caceresCommands: readonly Command[] = [
  caceresExpedientes,
  caceresNotificaciones,
  caceresRegistros,
  caceresDatosPersonales,
  caceresPadron,
  caceresProcedimiento,
  caceresDatosContacto,
  caceresAportar,
  caceresInstancia,
]
