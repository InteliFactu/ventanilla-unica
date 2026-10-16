import type { CliOptions } from '../../../cli/types/CliOptions'
import { validateNif } from '../../../tools/nif/validators/validateNif'
import type { NotaQuery } from '../types/NotaQuery'
import { validateNotaAddress } from './validateNotaAddress'
import { validateNotaContact } from './validateNotaContact'
import { validateNotaSegments } from './validateNotaSegments'

/** Check `registradores nota` options before any request. */
export const validateNotaQuery = (
  options: CliOptions,
  confirmed: boolean,
): NotaQuery => {
  const nif = validateNif(options['nif'] ?? '')
  if (!nif.valido || nif.tipo !== 'persona-juridica')
    throw new Error("--nif must be a company's NIF")
  const irpf = options['irpf'] ?? 'si'
  if (irpf !== 'si' && irpf !== 'no') throw new Error('--irpf takes si or no')
  return {
    nif: nif.normalizado,
    ...validateNotaContact(options),
    ...validateNotaAddress(options, confirmed),
    municipio: options['municipio']?.trim() || undefined,
    segments: validateNotaSegments(options['segmentos']),
    irpfRetention: irpf === 'si',
    outDir: options['out'],
  }
}
