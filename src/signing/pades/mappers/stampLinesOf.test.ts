import { describe, expect, it } from 'vitest'

import { stampLinesOf } from './stampLinesOf'

describe('stampLinesOf', () => {
  const details = {
    commonName: 'ANA',
    date: new Date(2026, 5, 15, 9, 5, 7),
    reason: 'Conforme',
  }

  it('defaults to the signer, the UTC date and the reason', () => {
    expect(stampLinesOf(details, undefined)).toEqual([
      'Firmado por ANA',
      `Fecha: ${details.date.toISOString().slice(0, 19).replace('T', ' ')} UTC`,
      'Motivo: Conforme',
    ])
  })

  it('fills an AutoFirma layer2Text template, one line per newline', () => {
    expect(
      stampLinesOf(
        details,
        'Firmado por $$SUBJECTCN$$\nel $$SIGNDATE=dd/MM/yyyy HH:mm:ss$$ ($$REASON$$) $$UNKNOWN$$',
      ),
    ).toEqual([
      'Firmado por ANA',
      'el 15/06/2026 09:05:07 (Conforme) $$UNKNOWN$$',
    ])
  })
})
