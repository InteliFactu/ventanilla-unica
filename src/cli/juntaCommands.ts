import { juntaCarpetaExpedientes } from './commands/juntaCarpetaExpedientes'
import { juntaCarpetaNotificaciones } from './commands/juntaCarpetaNotificaciones'
import { juntaDeudas } from './commands/juntaDeudas'
import { juntaDocumentos } from './commands/juntaDocumentos'
import { juntaExpedientes } from './commands/juntaExpedientes'
import { juntaJustificante } from './commands/juntaJustificante'
import { juntaNotificaciones } from './commands/juntaNotificaciones'
import { juntaPagos } from './commands/juntaPagos'
import { juntaPresentar } from './commands/juntaPresentar'
import { juntaRegistros } from './commands/juntaRegistros'
import { juntaRepresentados } from './commands/juntaRepresentados'
import { juntaTasas } from './commands/juntaTasas'
import type { Command } from './types/Command'

/** The Junta de Extremadura commands: STA sede reads, the Carpeta Ciudadana, and the general registry filing. */
export const juntaCommands: readonly Command[] = [
  juntaExpedientes,
  juntaNotificaciones,
  juntaRegistros,
  juntaPresentar,
  juntaJustificante,
  juntaDeudas,
  juntaTasas,
  juntaPagos,
  juntaCarpetaExpedientes,
  juntaCarpetaNotificaciones,
  juntaDocumentos,
  juntaRepresentados,
]
