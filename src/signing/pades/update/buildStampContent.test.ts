import { describe, expect, it } from 'vitest'

import { buildStampContent } from './buildStampContent'

describe('buildStampContent', () => {
  it('frames the box and writes the lines from its top', () => {
    const text = buildStampContent(
      ['Firmado por ANA', 'Motivo: (x)'],
      200,
      60,
    ).toString('latin1')
    expect(text).toContain('0.5 0.5 199 59 re S')
    expect(text).toContain('BT /Helv 8 Tf 0 g 6 44 Td\n(Firmado por ANA) Tj')
    expect(text).toContain('0 -12 Td (Motivo: \\(x\\)) Tj')
  })
})
