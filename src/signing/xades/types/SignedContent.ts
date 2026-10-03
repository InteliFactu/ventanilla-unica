import type { XmlDocument } from '../../xml/types/XmlDocument'

/** What is being signed: its bytes and, when it is XML, its tree. */
export type SignedContent = {
  readonly bytes: Buffer
  readonly document: XmlDocument | undefined
  /** Enveloped only: the id of the element signed by reference instead of the whole document. */
  readonly signedNodeId?: string | undefined
}
