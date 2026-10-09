import { selectDocumentType } from '../selectors/selectDocumentType'
import type { RelecDocument } from '../types/RelecDocument'
import type { RelecDocumentType } from '../types/RelecDocumentType'
import type { RelecFile } from '../types/RelecFile'
import type { RelecQuery } from '../types/RelecQuery'
import { mapUploadName } from './mapUploadName'

/** Pair each checked file with its type (resolved against the sede's list) and description. */
export const mapRelecDocuments = (
  files: readonly RelecFile[],
  query: RelecQuery,
  types: readonly RelecDocumentType[],
): readonly RelecDocument[] =>
  files.map((file, index) => {
    const type = selectDocumentType(types, query.typeCodes[index] ?? '')
    return {
      ...file,
      uploadName: mapUploadName(file.path),
      typeCode: type.code,
      typeDboid: type.dboid,
      description: query.descriptions[index] ?? '',
    }
  })
