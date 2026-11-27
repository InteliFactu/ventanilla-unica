import type { XmlElement } from '../../xml/types/XmlElement'
import { selectDirectElementPaths } from '../selectors/selectDirectElementPaths'

export const assertNoXadesArchiveTimestamp = (
  unsignedProperties: readonly (readonly XmlElement[])[],
): void => {
  const archiveNamespaces =
    /^http:\/\/uri\.etsi\.org\/01903\/(?:v1\.2\.2|v1\.3\.2|v1\.4\.1)#$/u
  if (
    unsignedProperties.some(
      (path) =>
        selectDirectElementPaths(path, 'ArchiveTimeStamp', archiveNamespaces)
          .length > 0,
    )
  ) {
    throw new Error('XAdES archive timestamp prevents countersigning')
  }
}
