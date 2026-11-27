import { model347DeclaredLayout } from '../layouts/model347DeclaredLayout'
import { model347PropertyLayout } from '../layouts/model347PropertyLayout'
import { validateBoeNif } from './validateBoeNif'
import { validateFixedWidthRecord } from './validateFixedWidthRecord'
import { validateModel347Declared } from './validateModel347Declared'

/** Check the two 2025 detail-sheet layouts and any supplied Spanish NIFs. */
export const validateModel347Detail = (record: string): readonly string[] => {
  const type = record.charAt(75)
  if (type !== 'D' && type !== 'I') return ['tipoHoja (76): expected D or I']
  const layout = type === 'D' ? model347DeclaredLayout : model347PropertyLayout
  const nif = record.slice(17, 26)
  return [
    ...validateFixedWidthRecord(layout, record),
    ...validateBoeNif(nif, 'nif (18-26)', true),
    ...validateBoeNif(record.slice(26, 35), 'nifRepresentante (27-35)', true),
    ...(type === 'D' ? validateModel347Declared(record) : []),
  ]
}
