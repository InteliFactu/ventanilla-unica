import type { StaRow } from '../../types/StaRow'
import type { StaCohabitant } from '../types/StaCohabitant'

/** One row of `ds_habitantes_DATOS_HABITANTE`, names with their padding collapsed. */
export const mapStaCohabitant = (row: StaRow): StaCohabitant => {
  const text = (key: string): string => {
    const value = row[key]
    return typeof value === 'string' ? value.replaceAll(/\s+/g, ' ').trim() : ''
  }
  return {
    name: text('nombreCompleto'),
    birthDate: text('fechaNacimiento'),
    sex: text('sexo'),
    minor: row['menor'] === true,
  }
}
