import type { XmlElement } from '../../xml/types/XmlElement'
import { xadesUris } from '../xadesUris'
import { selectDirectElementPaths } from './selectDirectElementPaths'

/** The direct SignedInfo references other than SignedProperties and KeyInfo. */
export const selectXadesDataReferences = (
  signaturePath: readonly XmlElement[],
): readonly (readonly XmlElement[])[] => {
  const [signedInfo] = selectDirectElementPaths(
    signaturePath,
    'SignedInfo',
    xadesUris.ds,
  )
  if (signedInfo === undefined) return []
  const [keyInfo] = selectDirectElementPaths(
    signaturePath,
    'KeyInfo',
    xadesUris.ds,
  )
  const keyId = keyInfo
    ?.at(-1)
    ?.attributes.find(({ name }) => name === 'Id')?.value
  return selectDirectElementPaths(signedInfo, 'Reference', xadesUris.ds).filter(
    (path) =>
      !path
        .at(-1)
        ?.attributes.some(
          ({ name, value }) =>
            (name === 'Type' && value === xadesUris.signedPropertiesType) ||
            (name === 'URI' && keyId !== undefined && value === `#${keyId}`),
        ),
  )
}
