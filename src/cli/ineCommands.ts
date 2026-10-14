import { ineAsignar } from './commands/ineAsignar'
import { ineEncuestas } from './commands/ineEncuestas'
import type { Command } from './types/Command'

/** The INE commands (IRIA, the statistical surveys portal). */
export const ineCommands: readonly Command[] = [ineEncuestas, ineAsignar]
