import type { RegistrySchema } from '../types/RegistrySchema'
import type { RegistrySlot } from '../types/RegistrySlot'

/**
 * Where a contribution to an expediente is uploaded: the procedure's
 * `apordocType`, listed in the body under the group `expedientes`, which is
 * what the SPA sends when the file is chosen from the holder's expedientes.
 */
export const selectContributionSlot = (
  schema: RegistrySchema,
): RegistrySlot => {
  const documentId = schema.apordocType?.id
  if (documentId === undefined)
    throw new Error('the procedure declares no contribution document type')
  return { groupId: 'expedientes', documentId }
}
