import { readAeatContact } from '../../aeat/contact/readAeatContact'
import type { Command } from '../types/Command'

/** `ventanilla-unica aeat contacto --nif <NIF>`: the avisos mobile and email and the fiscal and notification addresses. */
export const aeatContacto: Command = {
  portal: 'aeat',
  action: 'contacto',
  description:
    'The mobile and email the Agencia Tributaria sends avisos to, and the fiscal and notification addresses of Mis datos censales (--nif)',
  options: ['nif'],
  run: async (client, options) => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    return readAeatContact(client, nif)
  },
}
