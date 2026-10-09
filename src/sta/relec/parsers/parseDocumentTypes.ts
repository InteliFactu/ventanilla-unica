import type { RelecDocumentType } from '../types/RelecDocumentType'
import type { RelecTypesAnswer } from '../types/RelecTypesAnswer'

/** The `ApordocAjaxLoader?getTypes=0` answer, a JSON object wrapped in parentheses for `eval`, as types. */
export const parseDocumentTypes = (
  text: string,
): readonly RelecDocumentType[] => {
  const json = text.trim().replace(/^\(/, '').replace(/\);?$/, '')
  const parsed = JSON.parse(json) as RelecTypesAnswer
  const types = (parsed.resultado ?? []).map((raw) => ({
    code: raw.code ?? '',
    dboid: raw.dboid ?? '',
    name: raw.name ?? '',
    extensions: raw.extensions ?? '',
    maxSize: raw.maxSize ?? '0',
    reusable: raw.reusable ?? 'false',
  }))
  if (types.length === 0 || types.some((type) => !type.code || !type.dboid))
    throw new Error('ApordocAjaxLoader answered no usable document types')
  return types
}
