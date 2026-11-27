import { normalizeLabel } from '../../html/mappers/normalizeLabel'
import type { SexpeDemandStatus } from '../types/SexpeDemandStatus'

/** Recognize an explicit administrative status without inferring it. */
export const parseSexpeDemandStatus = (value: string): SexpeDemandStatus => {
  const status = normalizeLabel(value)
  if (status === 'ALTA' || status === 'BAJA') return status
  if (status === 'SUSPENSION') return 'SUSPENSIÓN'
  throw new Error('SEXPE: unrecognized demand status')
}
