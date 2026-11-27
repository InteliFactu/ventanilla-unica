import { rayuelaCalificaciones } from './commands/rayuelaCalificaciones'
import { rayuelaFaltas } from './commands/rayuelaFaltas'
import { rayuelaHijos } from './commands/rayuelaHijos'
import { rayuelaHorario } from './commands/rayuelaHorario'
import { rayuelaMensajes } from './commands/rayuelaMensajes'
import { rayuelaProfesorado } from './commands/rayuelaProfesorado'
import { rayuelaResponder } from './commands/rayuelaResponder'
import type { Command } from './types/Command'

/** Password-authenticated educational monitoring. */
export const rayuelaCommands: readonly Command[] = [
  rayuelaHijos,
  rayuelaMensajes,
  rayuelaHorario,
  rayuelaFaltas,
  rayuelaProfesorado,
  rayuelaCalificaciones,
  rayuelaResponder,
]
