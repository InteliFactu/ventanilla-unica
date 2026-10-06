import { shortRecordModels } from './shortRecordModels'

/** Record length per model; 192 was 250 before 2024. */
export const recordLengthOf = (modelo: string, ejercicio: string): number =>
  shortRecordModels.has(modelo) || (modelo === '192' && ejercicio < '2024')
    ? 250
    : 500
