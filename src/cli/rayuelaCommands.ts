import { rayuelaCalificaciones } from './commands/rayuelaCalificaciones'
import { rayuelaComportamiento } from './commands/rayuelaComportamiento'
import { rayuelaConductas } from './commands/rayuelaConductas'
import { rayuelaExamenes } from './commands/rayuelaExamenes'
import { rayuelaFaltas } from './commands/rayuelaFaltas'
import { rayuelaHijos } from './commands/rayuelaHijos'
import { rayuelaHorario } from './commands/rayuelaHorario'
import { rayuelaMensajes } from './commands/rayuelaMensajes'
import { rayuelaNotasClase } from './commands/rayuelaNotasClase'
import { rayuelaProfesorado } from './commands/rayuelaProfesorado'
import { rayuelaResponder } from './commands/rayuelaResponder'
import { rayuelaTrabajos } from './commands/rayuelaTrabajos'
import type { Command } from './types/Command'

/** Password-authenticated educational monitoring. */
export const rayuelaCommands: readonly Command[] = [
  rayuelaHijos,
  rayuelaMensajes,
  rayuelaHorario,
  rayuelaFaltas,
  rayuelaProfesorado,
  rayuelaCalificaciones,
  rayuelaExamenes,
  rayuelaTrabajos,
  rayuelaNotasClase,
  rayuelaComportamiento,
  rayuelaConductas,
  rayuelaResponder,
]
