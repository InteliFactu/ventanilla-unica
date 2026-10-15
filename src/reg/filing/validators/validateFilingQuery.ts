import type { CliOptions } from '../../../cli/types/CliOptions'
import type { RegFilingQuery } from '../types/RegFilingQuery'

/** `reg presentar`'s options; every field the front marks required must be present, and the postal code has five digits. */
export const validateFilingQuery = (options: CliOptions): RegFilingQuery => {
  const required = (name: string): string => {
    const value = options[name]?.trim()
    if (!value) throw new Error(`reg presentar needs --${name}`)
    return value
  }
  const zipCode = required('cp')
  if (!/^\d{5}$/.test(zipCode))
    throw new Error(`--cp must be five digits, got "${zipCode}"`)
  return {
    organism: required('organismo'),
    subject: required('asunto'),
    exposes: required('expone'),
    request: required('solicita'),
    documents: required('documentos')
      .split(',')
      .map((path) => path.trim()),
    viaType: required('tipo-via'),
    via: required('via'),
    zipCode,
    province: required('provincia'),
    town: required('municipio'),
    email: options['email']?.trim() ?? '',
    phone: options['telefono']?.trim() ?? '',
  }
}
