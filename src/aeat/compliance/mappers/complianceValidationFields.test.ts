import { describe, expect, it } from 'vitest'

import { complianceValidationFields } from './complianceValidationFields'

describe('complianceValidationFields', () => {
  it('asks for the holder itself, as of today, with the given type', () => {
    const fields = new Map(complianceValidationFields('tok', 'C1'))

    expect(fields.get('fTipoCertificado')).toBe('C1')
    expect(fields.get('fTipoRepresentacion')).toBe('1')
    expect(fields.get('fMomentoDeterminacionEcot')).toBe('1')
    expect(fields.get('fFechaPasada')).toBe('')
    expect(fields.get('fAccion')).toBe('2')
    expect(fields.get('fIslw')).toBe('tok')
  })
})
