import { carpetaAvisos } from './commands/carpetaAvisos'
import { carpetaConfirmarEmail } from './commands/carpetaConfirmarEmail'
import { carpetaEmail } from './commands/carpetaEmail'
import type { Command } from './types/Command'

/** The state Carpeta Ciudadana commands: the alert settings and the alert e-mail with its verification. */
export const carpetaCommands: readonly Command[] = [
  carpetaAvisos,
  carpetaEmail,
  carpetaConfirmarEmail,
]
