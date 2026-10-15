import { expect, it } from 'vitest'
import { parseRayuelaEnrolment } from './parseRayuelaEnrolment'

it('reads synthetic parseRayuelaEnrolment markup', () => {
  expect(
    parseRayuelaEnrolment('School<br>5º Primary (B)<br>Tutor: Taylor Example'),
  ).toEqual({
    school: 'School',
    course: '5º Primary',
    group: 'B',
    tutor: 'Taylor Example',
  })
  expect(parseRayuelaEnrolment('')).toEqual({
    school: '',
    course: '',
    group: '',
    tutor: '',
  })
})
