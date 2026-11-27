import { carpetaActivarAvisos } from './commands/carpetaActivarAvisos'
import { carpetaAvisos } from './commands/carpetaAvisos'
import { carpetaConfirmarEmail } from './commands/carpetaConfirmarEmail'
import { carpetaEmail } from './commands/carpetaEmail'
import { carpetaRegistros } from './commands/carpetaRegistros'
import type { Command } from './types/Command'

/** The state Carpeta Ciudadana commands: the alert settings, the alert e-mail with its verification, and the general-registry entries. */
export const carpetaCommands: readonly Command[] = [
  carpetaAvisos,
  carpetaActivarAvisos,
  carpetaEmail,
  carpetaConfirmarEmail,
  carpetaRegistros,
]
