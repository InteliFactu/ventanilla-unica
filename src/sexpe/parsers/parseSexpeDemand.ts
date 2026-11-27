import type { SexpeDemand } from '../types/SexpeDemand'
import { parseSexpeDemandStatus } from './parseSexpeDemandStatus'
import { readSexpeAdministrativeSection } from './readSexpeAdministrativeSection'
import { readSexpeDemandFields } from './readSexpeDemandFields'

/** Extract administrative status without emitting unrelated personal fields. */
export const parseSexpeDemand = (html: string): SexpeDemand => {
  const fields = readSexpeDemandFields(readSexpeAdministrativeSection(html))
  const status = fields.get('SITUACION DE DEMANDA:')
  const cause = fields.get('CAUSA DE SITUACION:')
  const employmentStatus = fields.get('SITUACION LABORAL:')
  const specialGroup = fields.get('COLECTIVO ESPECIAL:')
  if (
    status === undefined ||
    cause === undefined ||
    employmentStatus === undefined ||
    specialGroup === undefined
  )
    throw new Error('SEXPE: the administrative status section is incomplete')
  return {
    status: parseSexpeDemandStatus(status),
    cause: cause || null,
    employmentStatus: employmentStatus || null,
    specialGroup: specialGroup || null,
  }
}
