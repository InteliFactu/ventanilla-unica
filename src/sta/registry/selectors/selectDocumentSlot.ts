import type { RegistrySchema } from '../types/RegistrySchema'
import type { RegistrySlot } from '../types/RegistrySlot'

/** The general registry has a single "Documentación adjunta" slot; take the first one declared. */
export const selectDocumentSlot = (schema: RegistrySchema): RegistrySlot => {
  const element = schema.sections.documents?.elements[0]
  const document = element?.documents[0]
  if (!element || !document)
    throw new Error('the procedure declares no attachment slot')
  return { groupId: element.id, documentId: document.id }
}
