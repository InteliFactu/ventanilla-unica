import { validateBoeNif } from '../../boeFixedWidth/validators/validateBoeNif'
import { validateFixedWidthRecord } from '../../boeFixedWidth/validators/validateFixedWidthRecord'
import { model190PerceptorLayout } from '../layouts/model190PerceptorLayout'

/** Check a 2025 perceptor record's positions and tax identifier formats. */
export const validateModel190Perceptor = (
  record: string,
): readonly string[] => [
  ...validateFixedWidthRecord(model190PerceptorLayout, record),
  ...validateBoeNif(record.slice(17, 26), 'nif (18-26)'),
  ...validateBoeNif(record.slice(26, 35), 'nifRepresentante (27-35)', true),
  ...validateBoeNif(record.slice(157, 166), 'nifConyuge (158-166)', true),
  ...(/[ADJ]/.test(record.charAt(77)) && record.slice(78, 80) !== '00'
    ? ['subclave (79-80): this clave does not use a subclave']
    : []),
]
