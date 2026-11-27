import type { XmlElement } from '../../xml/types/XmlElement'
import { xadesElementNamespace } from '../xadesElementNamespace'
import { xadesUris } from '../xadesUris'
import { selectDirectElementPaths } from './selectDirectElementPaths'
import { selectIdOf } from './selectIdOf'

/** Find the properties belonging to this signature, outside any payload subtree. */
export const selectXadesQualifyingPath = (
  signature: readonly XmlElement[],
): readonly XmlElement[] => {
  const target = `#${selectIdOf(signature.at(-1))}`
  const matches = selectDirectElementPaths(signature, 'Object', xadesUris.ds)
    .flatMap((object) =>
      selectDirectElementPaths(
        object,
        'QualifyingProperties',
        xadesElementNamespace,
      ),
    )
    .filter((path) =>
      path
        .at(-1)
        ?.attributes.some(
          ({ name, value }) => name === 'Target' && value === target,
        ),
    )
  const [match] = matches
  if (match === undefined || matches.length !== 1)
    throw new Error(
      'the signature has no unique QualifyingProperties referencing its Id',
    )
  return match
}
