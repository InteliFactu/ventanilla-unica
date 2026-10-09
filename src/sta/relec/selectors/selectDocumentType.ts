import type { RelecDocumentType } from '../types/RelecDocumentType'

/** The type with this code among those the sede offers; an unknown code is refused with the valid ones. */
export const selectDocumentType = (
  types: readonly RelecDocumentType[],
  code: string,
): RelecDocumentType => {
  const type = types.find((candidate) => candidate.code === code)
  if (type === undefined)
    throw new Error(
      `unknown document type ${code}; the sede offers ${types.map((candidate) => candidate.code).join(', ')}`,
    )
  return type
}
