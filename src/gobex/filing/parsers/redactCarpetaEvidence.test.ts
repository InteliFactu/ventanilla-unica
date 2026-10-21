import { describe, expect, it } from 'vitest'

import { redactCarpetaEvidence } from './redactCarpetaEvidence'

describe('redactCarpetaEvidence', () => {
  it('removes transient view state and callback values while keeping the receipt evidence', () => {
    const html =
      '<input name="javax.faces.ViewState" value="temporary-state"><input name="f_solicitud:firma" value="signature"><input name="f_solicitud:certificadoUsado" value="certificate"><input name="f_solicitud:rue" value="5145000000000000000001">Registered'
    const result = redactCarpetaEvidence(html)
    expect(result).not.toContain('temporary-state')
    expect(result).not.toContain('signature')
    expect(result).not.toContain('certificate')
    expect(result).toContain('5145000000000000000001')
    expect(result).toContain('Registered')
  })
})
