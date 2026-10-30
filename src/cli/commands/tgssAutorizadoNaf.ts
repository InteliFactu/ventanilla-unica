import { readNafRedAuthorisation } from '../../tgss/nafAuthorisation/readNafRedAuthorisation'
import type { Command } from '../types/Command'

export const tgssAutorizadoNaf: Command = {
  portal: 'tgss',
  action: 'autorizado-naf',
  description:
    "Read which Sistema RED authorisation manages the holder's NAF (RETC0002) now, and which managed it before, with the dates",
  options: [],
  run: async (client): Promise<unknown> => readNafRedAuthorisation(client),
}
