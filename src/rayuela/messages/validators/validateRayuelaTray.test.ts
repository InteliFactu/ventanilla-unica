import { expect, it } from 'vitest'
import { validateRayuelaTray } from './validateRayuelaTray'

it('defaults to the inbox and accepts only REC and ENV', () => {
  expect(validateRayuelaTray(undefined)).toBe('REC')
  expect(validateRayuelaTray('env')).toBe('ENV')
  expect(() => validateRayuelaTray('BOR')).toThrow('--bandeja')
})
