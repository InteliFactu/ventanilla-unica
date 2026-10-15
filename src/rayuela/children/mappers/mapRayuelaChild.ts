import { htmlToText } from '../../../html/htmlToText'
import { readRayuelaFields } from '../../session/parsers/readRayuelaFields'
import { parseRayuelaEnrolment } from '../parsers/parseRayuelaEnrolment'
import { parseRayuelaPupilLogin } from '../parsers/parseRayuelaPupilLogin'
import type { RayuelaChild } from '../types/RayuelaChild'
/** Map the labelled pupil details and the displayed enrolment. */
export const mapRayuelaChild = (html: string): RayuelaChild => {
  const fields = readRayuelaFields(html)
  return {
    name: htmlToText(fields.get('Nombre') ?? ''),
    birthDate: htmlToText(fields.get('Fecha de nacimiento') ?? ''),
    nia: htmlToText(fields.get('NIA') ?? ''),
    ...parseRayuelaEnrolment(fields.get('Centros') ?? ''),
    pupilLogin: parseRayuelaPupilLogin(html),
    legalGuardians: (fields.get('Tutores legales') ?? '')
      .split(/<br\s*\/?>/i)
      .map(htmlToText)
      .filter(Boolean),
  }
}
