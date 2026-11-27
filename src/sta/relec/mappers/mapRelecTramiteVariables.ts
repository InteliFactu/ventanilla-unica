import { encodeLatin1 } from '../../../http/encodeLatin1'
import { parseRelecVariables } from '../parsers/parseRelecVariables'
import type { RelecTramiteVariable } from '../types/RelecTramiteVariable'

/** Resolve every supplied variable against the current form before any upload. */
export const mapRelecTramiteVariables = (
  fields: Readonly<Record<string, string>>,
  values: Readonly<Record<string, string>>,
  writable: ReadonlySet<string>,
): readonly RelecTramiteVariable[] => {
  const offered = parseRelecVariables(fields)
  return Object.entries(values).map(([name, value]) => {
    if (name === 'ANNOT_TEXT_EXTRACT')
      throw new Error('Use --asunto to set the Asunto field')
    const variable = offered.find((candidate) => candidate.name === name)
    if (!variable || !writable.has(name))
      throw new Error(
        `The procedure does not offer a writable field named ${name}`,
      )
    encodeLatin1(value)
    return { ...variable, value }
  })
}
