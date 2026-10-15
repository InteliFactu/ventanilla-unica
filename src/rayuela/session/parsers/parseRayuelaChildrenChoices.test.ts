import { expect, it } from 'vitest'
import { parseRayuelaChildrenChoices } from './parseRayuelaChildrenChoices'

it('parseRayuelaChildrenChoices reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    parseRayuelaChildrenChoices(
      "new PopUp('X_ALUMNO_123', 'Example, Dana', '123', cambioHijo)",
    ),
  ).toEqual([{ id: '123', name: 'Example, Dana' }])
  expect(parseRayuelaChildrenChoices('')).toEqual([])
})
