import { htmlToText } from '../../../html/htmlToText'
import type { RayuelaEnrolment } from '../types/RayuelaEnrolment'
/** School, course (group) and tutor occupy separate lines. */
export const parseRayuelaEnrolment = (html: string): RayuelaEnrolment => {
  const lines = html
    .split(/<br\s*\/?>/i)
    .map(htmlToText)
    .filter(Boolean)
  const course = lines[1] ?? ''
  const opening = course.lastIndexOf('(')
  const grouped = opening >= 0 && course.endsWith(')')
  return {
    school: lines[0] ?? '',
    course: grouped ? course.slice(0, opening).trim() : course,
    group: grouped ? course.slice(opening + 1, -1) : '',
    tutor: (lines[2] ?? '').replace(/^Tutor\s*:\s*/i, ''),
  }
}
