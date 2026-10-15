import { describe, expect, it } from 'vitest'

import { serializePdfValue } from '../objects/serializePdfValue'
import { buildSignatureDict } from './buildSignatureDict'

describe('buildSignatureDict', () => {
  const date = new Date('2026-09-26T08:07:06Z')

  it('declares a CAdES detached signature with placeholders', () => {
    const text = serializePdfValue(
      buildSignatureDict({ commonName: 'ANA', date }),
    )
    expect(text).toContain(
      '/Filter /Adobe.PPKLite /SubFilter /ETSI.CAdES.detached',
    )
    expect(text).toContain('/ByteRange [0 0000000000 0000000000 0000000000]')
    expect(text).toContain("/M (D:20260926080706+00'00') /Name (ANA)")
    expect(text).toMatch(/\/Contents <0{54000}>/)
    expect(text).not.toContain('/Reason')
  })

  it('adds reason and location when given', () => {
    const text = serializePdfValue(
      buildSignatureDict({
        commonName: 'ANA',
        date,
        reason: 'Ok',
        location: 'Cáceres',
      }),
    )
    expect(text).toContain('/Reason (Ok) /Location <FEFF')
  })
})
