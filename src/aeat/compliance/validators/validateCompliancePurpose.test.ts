import { describe, expect, it } from 'vitest'

import { validateCompliancePurpose } from './validateCompliancePurpose'

describe('validateCompliancePurpose', () => {
  it('defaults to contratacion', () => {
    expect(validateCompliancePurpose(undefined)).toBe('contratacion')
  })

  it('accepts a purpose by name', () => {
    expect(validateCompliancePurpose('subvenciones')).toBe('subvenciones')
    expect(validateCompliancePurpose('generico')).toBe('generico')
  })

  it('rejects an unknown purpose naming every accepted one', () => {
    expect(() => validateCompliancePurpose('C1')).toThrow(
      /--finalidad must be one of contratacion, subvenciones, generico; got "C1"/,
    )
  })
})
