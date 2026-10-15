import { describe, expect, it } from 'vitest'

import { validateSignXmlPolicyName } from './validateSignXmlPolicyName'

describe('validateSignXmlPolicyName', () => {
  it('defaults to ninguna and accepts facturae', () => {
    expect(validateSignXmlPolicyName(undefined)).toBe('ninguna')
    expect(validateSignXmlPolicyName('facturae')).toBe('facturae')
    expect(validateSignXmlPolicyName('age')).toBe('age')
    expect(() => validateSignXmlPolicyName('epes')).toThrow(
      '--politica must be',
    )
  })
})
