import { describe, expect, it } from 'vitest'

import { validateXadesMode } from './validateXadesMode'

describe('validateXadesMode', () => {
  it('defaults to enveloped and accepts the four modes', () => {
    expect(validateXadesMode(undefined)).toBe('enveloped')
    expect(validateXadesMode('detached')).toBe('detached')
    expect(validateXadesMode('internally-detached')).toBe('internally-detached')
    expect(() => validateXadesMode('attached')).toThrow('--modo must be')
  })
})
