import { dehuComparecer } from './commands/dehuComparecer'
import { dehuContacto } from './commands/dehuContacto'
import { dehuDocumentos } from './commands/dehuDocumentos'
import { dehuList } from './commands/dehuList'
import type { Command } from './types/Command'

/** The DEHU commands: the notification list, their documents, the appearance and the avisos contact. */
export const dehuCommands: readonly Command[] = [
  dehuList,
  dehuDocumentos,
  dehuComparecer,
  dehuContacto,
]
