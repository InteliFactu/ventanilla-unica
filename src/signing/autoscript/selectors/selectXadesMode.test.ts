import { describe, expect, it } from 'vitest'

import { parseExtraParams } from '../parsers/parseExtraParams'
import { selectXadesMode } from './selectXadesMode'

describe('selectXadesMode', () => {
  it.each([
    ['XAdES', '', false, 'enveloping'],
    ['XAdES Enveloped', '', false, 'enveloped'],
    ['XAdES Detached', '', false, 'internally-detached'],
    ['XAdES', 'format=XAdES Externally Detached', false, 'detached'],
    ['XAdES', '', true, 'internally-detached'],
    ['XAdES Enveloped', '', true, 'enveloped'],
  ])('%s with "%s" (AGE %s) is %s', (format, params, age, mode) => {
    expect(selectXadesMode(format, parseExtraParams(params), age)).toBe(mode)
  })
})
