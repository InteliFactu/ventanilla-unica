import { carpetaActivarAvisos } from './commands/carpetaActivarAvisos'
import { carpetaAvisos } from './commands/carpetaAvisos'
import { carpetaConfirmarEmail } from './commands/carpetaConfirmarEmail'
import { carpetaDemandaEmpleo } from './commands/carpetaDemandaEmpleo'
import { carpetaEmail } from './commands/carpetaEmail'
import { carpetaRegistros } from './commands/carpetaRegistros'
import type { Command } from './types/Command'

/** Commands backed by Mi Carpeta Ciudadana. */
export const carpetaCommands: readonly Command[] = [
  carpetaAvisos,
  carpetaActivarAvisos,
  carpetaEmail,
  carpetaConfirmarEmail,
  carpetaRegistros,
  carpetaDemandaEmpleo,
]
