import type { XmlElement } from '../../xml/types/XmlElement'

/** A data reference outside its signature and the parent for the new signature. */
export type DetachedCosignature = {
  readonly signature: XmlElement
  readonly referencePath: readonly XmlElement[]
  readonly contentPath: readonly XmlElement[] | undefined
  readonly parent: XmlElement | undefined
}
