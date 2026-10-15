import { expect, it } from 'vitest'
import { validateRayuelaUrl } from './validateRayuelaUrl'

it('validateRayuelaUrl reads synthetic portal markup and rejects unsupported input', () => {
  expect(validateRayuelaUrl('Menu.jsp')).toBe(
    'https://rayuela.educarex.es/segedu/jsp/Menu.jsp',
  )
  for (const value of [
    'https://evil.example',
    'http://rayuela.educarex.es',
    'https://user:password@rayuela.educarex.es',
  ])
    expect(() => validateRayuelaUrl(value)).toThrow('unexpected URL')
})
