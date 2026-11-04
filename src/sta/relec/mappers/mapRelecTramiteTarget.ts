import { parseRelecUploadUrl } from '../parsers/parseRelecUploadUrl'
import type { RelecInstanceDocument } from '../types/RelecInstanceDocument'
import type { RelecUploadTarget } from '../types/RelecUploadTarget'
import { mapUploadName } from './mapUploadName'

/** Fixed catalogue rows use the DocReq id, never a numeric array index. */
export const mapRelecTramiteTarget = (
  origin: string,
  html: string,
  person: string,
  document: RelecInstanceDocument,
): RelecUploadTarget => ({
  origin,
  slot: document.slot.dboid,
  person,
  document: {
    ...document,
    uploadName: mapUploadName(document.path),
    typeCode: '',
    typeDboid: document.slot.typeDboid,
    description: document.slot.description,
  },
  type: {
    code: '',
    dboid: document.slot.typeDboid,
    name: document.slot.name,
    extensions: 'pdf',
    maxSize: '50000',
    reusable: 'false',
  },
  popupUrl: parseRelecUploadUrl(html, origin, document.slot.dboid, person),
})
