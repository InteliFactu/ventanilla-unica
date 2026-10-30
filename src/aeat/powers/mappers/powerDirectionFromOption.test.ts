import { describe, expect, it } from 'vitest'

import { powerDirectionFromOption } from './powerDirectionFromOption'

describe('powerDirectionFromOption', () => {
  it('defaults to granted and accepts both names', () => {
    expect(powerDirectionFromOption(undefined)).toBe('granted')
    expect(powerDirectionFromOption('otorgados')).toBe('granted')
    expect(powerDirectionFromOption('recibidos')).toBe('received')
  })

  it('refuses anything else', () => {
    expect(() => powerDirectionFromOption('todos')).toThrow('--tipo')
  })
})
