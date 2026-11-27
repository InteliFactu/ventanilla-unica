import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaGrades } from './parsers/parseRayuelaGrades'
import type { RayuelaGrades } from './types/RayuelaGrades'
import { validateRayuelaAcademicYear } from './validators/validateRayuelaAcademicYear'
/** Read one child's grades; the portal defaults to the current academic year. */
export const readRayuelaGrades = async (
  client: HttpClient,
  child?: string,
  academicYear?: string,
): Promise<RayuelaGrades> => {
  const expectedYear =
    academicYear === undefined
      ? undefined
      : validateRayuelaAcademicYear(academicYear)
  const page = await fetchRayuelaPage(
    client,
    'RegNotCurAct',
    child,
    expectedYear === undefined ? undefined : { C_ANNO: expectedYear },
  )
  return parseRayuelaGrades(page, expectedYear)
}
