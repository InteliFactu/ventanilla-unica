import { expect, it } from 'vitest'
import { parseRayuelaSubjectGrades } from './parseRayuelaSubjectGrades'

it('parseRayuelaSubjectGrades pairs grades with headings and keeps missing ones empty', () => {
  expect(
    parseRayuelaSubjectGrades(['Maths', 'Comunes', 'Bien'], ['1ª', '2ª']),
  ).toEqual({
    subject: 'Maths',
    type: 'Comunes',
    grades: [
      { evaluation: '1ª', grade: 'Bien' },
      { evaluation: '2ª', grade: '' },
    ],
  })
})
