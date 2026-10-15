import { readSanctions } from '../../dgt/sanctions/readSanctions'
import type { Command } from '../types/Command'

/** `ventanilla-unica dgt sanciones [--out <dir>]`: the holder's fines in Mi DGT. */
export const dgtSanciones: Command = {
  portal: 'dgt',
  action: 'sanciones',
  description:
    'The holder\'s fines in Mi DGT ("Mis sanciones"): expediente, state, date, province, amount and the detail page (offence, article, paid); --out saves each "Datos de Expediente" PDF',
  options: [],
  run: async (client, options) => readSanctions(client, options['out']),
}
