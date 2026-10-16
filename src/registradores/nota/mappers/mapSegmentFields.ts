import type { NotaSegment } from '../types/NotaSegment'

/**
 * The segments form as Spring binds it: every checkbox has an `_name=on`
 * companion, and a checked one adds `name=true`. "Administradores y cargos
 * sociales" sits under the "Representación social" group, which is checked
 * with it. No personal reference is added to the e-mail subject.
 */
export const mapSegmentFields = (
  segments: readonly NotaSegment[],
): Record<string, string> => {
  const checked = new Set<string>(segments)
  if (checked.has('administradores')) checked.add('socialRep')
  const fields: Record<string, string> = { reference: '' }
  for (const name of [
    'selectAll',
    'capital',
    'socialRep',
    'administradores',
    'actos',
    'libros',
    'checkReference',
  ]) {
    fields[`_${name}`] = 'on'
    if (checked.has(name)) fields[name] = 'true'
  }
  return fields
}
