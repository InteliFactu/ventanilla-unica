import { describe, expect, it } from 'vitest'

import { parseComplianceSign } from './parseComplianceSign'

describe('parseComplianceSign', () => {
  it('reads the stated sign, with or without "de"', () => {
    expect(parseComplianceSign('tiene carácter POSITIVO y una validez')).toBe(
      true,
    )
    expect(parseComplianceSign('tiene carácter de NEGATIVO y una')).toBe(false)
  })

  it('prefers the stated sentence over a stray word', () => {
    expect(
      parseComplianceSign('saldo NEGATIVO compensado; tiene caracter POSITIVO'),
    ).toBe(true)
  })

  it('falls back to a bare NEGATIVO before a bare POSITIVO', () => {
    expect(parseComplianceSign('certificado NEGATIVO ... POSITIVO')).toBe(false)
    expect(parseComplianceSign('certificado POSITIVO')).toBe(true)
  })

  it('is undefined when the text states neither', () => {
    expect(parseComplianceSign('CERTIFICADO')).toBeUndefined()
  })
})
