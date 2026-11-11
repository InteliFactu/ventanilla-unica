import { describe, expect, it } from 'vitest'

import { readInputValueById } from './readInputValueById'

describe('readInputValueById', () => {
  const html =
    '<input type="text" id="prefijo" value="+34"/><input id="movil" value=" 600000000 "/><input id="email" maxlength="40" value="" /><input id="x" value="a&amp;b">'

  it('reads the trimmed, decoded value of the input with that id', () => {
    expect(readInputValueById(html, 'prefijo')).toBe('+34')
    expect(readInputValueById(html, 'movil')).toBe('600000000')
    expect(readInputValueById(html, 'x')).toBe('a&b')
  })

  it('answers null for a blank value or a missing input', () => {
    expect(readInputValueById(html, 'email')).toBeNull()
    expect(readInputValueById(html, 'fijo')).toBeNull()
  })
})
