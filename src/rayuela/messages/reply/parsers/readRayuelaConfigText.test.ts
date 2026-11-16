import { expect, it } from 'vitest'
import { readRayuelaConfigText } from './readRayuelaConfigText'

it('reads strings and numbers and rejects a missing field', () => {
  expect(readRayuelaConfigText({ a: 7, b: 'x' }, 'a')).toBe('7')
  expect(readRayuelaConfigText({ a: 7, b: 'x' }, 'b')).toBe('x')
  expect(() => readRayuelaConfigText({}, 'c')).toThrow('missing: c')
})
