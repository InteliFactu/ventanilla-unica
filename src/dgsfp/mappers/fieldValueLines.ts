import { formatSpanishDate } from '../formatters/formatSpanishDate'
import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'
import { fileValueLines } from './fileValueLines'

/**
 * The value lines the request document prints under a field's label, per the
 * page's `getValorCampo*`: "(key) value" for lists and keyed values, file name
 * and hash for files plus any remarks, a long date, nothing for a yes/no
 * switch (its answer goes on the label line) or an empty value.
 */
export const fieldValueLines = (field: DgsfpFieldValue): readonly string[] => {
  const keyed = field.key !== '' && field.key !== '-1'
  if (field.tipo === 'DatosControlFichero') return fileValueLines(field)
  if (field.tipo === 'DatosControlSiNo' || field.value === '') return []
  if (field.tipo === 'DatosControlFecha')
    return [formatSpanishDate(field.value)]
  if (field.tipo === 'DatosControlLista')
    return keyed ? [`(${field.key}) ${field.value}`] : []
  const [first = '', ...rest] = field.value.split('\n')
  return [keyed ? `(${field.key}) ${first}` : first, ...rest]
}
