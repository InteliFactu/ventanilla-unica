import { describe, expect, it } from 'vitest'

import { signXmlFileNotes } from './signXmlFileNotes'

const request = {
  input: '/tmp/in/factura.xml',
  output: '/tmp/out.xsig',
  mode: 'enveloped',
  policy: 'ninguna',
} as const

describe('signXmlFileNotes', () => {
  it('says nothing for an enveloped signature', () => {
    expect(signXmlFileNotes(request, true)).toEqual([])
  })
  it('explains detached, base64 and misplaced Facturae signatures', () => {
    expect(
      signXmlFileNotes(
        { ...request, mode: 'detached', policy: 'facturae' },
        true,
      ),
    ).toEqual([
      'the signature references "factura.xml" by name: keep both files together',
      'FACe and the AEAT expect Facturae signed enveloped',
    ])
    expect(signXmlFileNotes({ ...request, mode: 'enveloping' }, false)).toEqual(
      ['the input is not XML: it is carried in base64 inside ds:Object'],
    )
  })
  it('warns that the AGE policy is not for enveloping signatures', () => {
    expect(
      signXmlFileNotes({ ...request, mode: 'enveloping', policy: 'age' }, true),
    ).toEqual(['the AGE policy asks for enveloped or detached signatures'])
  })
})
