import { requestNotaInformativa } from '../../registradores/nota/requestNotaInformativa'
import { validateNotaQuery } from '../../registradores/nota/validators/validateNotaQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const registradoresNota: Command = {
  portal: 'registradores',
  action: 'nota',
  description:
    "Order a company's nota informativa mercantil at sede.registradores.org as its representative. Without --confirmar si it finds the company (IRUS, registry, whether accounts are deposited) and prints the identification it would post; with --confirmar si it creates the order for card payment and prints the hosted checkout URL (--out writes a page that opens it). It never pays",
  options: [
    'nif',
    'email',
    'telefono',
    'direccion',
    'codigo-postal',
    'municipio',
    'segmentos',
    'irpf',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const confirmed = isConfirmed(options)
    return requestNotaInformativa(
      client,
      validateNotaQuery(options, confirmed),
      confirmed,
    )
  },
}
