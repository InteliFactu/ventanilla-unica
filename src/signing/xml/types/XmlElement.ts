import type { XmlAttribute } from './XmlAttribute'
import type { XmlComment } from './XmlComment'
import type { XmlProcessingInstruction } from './XmlProcessingInstruction'
import type { XmlText } from './XmlText'

/** An element: its qualified name, its attributes in document order and its children (an `XmlNode` each, spelled out here so the two types do not import each other). */
export type XmlElement = {
  readonly kind: 'element'
  readonly name: string
  readonly attributes: XmlAttribute[]
  readonly children: (
    XmlElement | XmlText | XmlComment | XmlProcessingInstruction
  )[]
}
