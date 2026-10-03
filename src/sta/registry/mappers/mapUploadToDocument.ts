import type { RegistrySlot } from '../types/RegistrySlot'
import type { RegistryUpload } from '../types/RegistryUpload'

/** How an uploaded file is listed in the request body: its stored identity, its position and its group. */
export const mapUploadToDocument = (
  upload: RegistryUpload,
  index: number,
  slot: RegistrySlot,
): Readonly<Record<string, unknown>> => ({
  id: upload.id,
  hash: upload.hash,
  size: upload.size,
  order: index + 1,
  name: upload.name,
  mimeType: upload.mimeType,
  gid: slot.groupId,
  description: null,
  sign: false,
})
