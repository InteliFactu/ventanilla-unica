import { expect, it } from 'vitest'

import { decodeRayuelaAnswer } from './decodeRayuelaAnswer'

it('reads UTF-8 and falls back to Latin-1', () => {
  expect(decodeRayuelaAnswer(Buffer.from('Tutoría', 'utf8'))).toBe('Tutoría')
  expect(decodeRayuelaAnswer(Buffer.from('Tutoría', 'latin1'))).toBe('Tutoría')
})
