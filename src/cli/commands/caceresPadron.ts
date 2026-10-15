import { readStaPadron } from '../../sta/padron/readStaPadron'
import type { Command } from '../types/Command'

/** `ventanilla-unica caceres padron`: the holder's padrón entry at the Ayuntamiento de Cáceres. */
export const caceresPadron: Command = {
  portal: 'caceres',
  action: 'padron',
  description:
    "Read the holder's padrón entry at the Ayuntamiento de Cáceres sede (alta date, address, birth, census district and section, people registered at the same address), or registered: false when the sede says they are not inscribed",
  options: [],
  run: async (client): Promise<unknown> => readStaPadron(client),
}
