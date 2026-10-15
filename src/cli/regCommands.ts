import { regOrganismos } from './commands/regOrganismos'
import { regPresentar } from './commands/regPresentar'
import { regRegistro } from './commands/regRegistro'
import { regRegistros } from './commands/regRegistros'
import type { Command } from './types/Command'

/** The Registro Electrónico General commands: the holder's entries, one entry, and the DIR3 search and the filing. */
export const regCommands: readonly Command[] = [
  regRegistros,
  regRegistro,
  regOrganismos,
  regPresentar,
]
