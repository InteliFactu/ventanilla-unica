import { describe, expect, it } from 'vitest'

import { subjectNifs } from './subjectNifs'

describe('subjectNifs', () => {
  it('reads the holder and the represented entity', () => {
    expect(
      subjectNifs(
        'serialNumber=IDCES-76048463K\nGN=CHRISTIAN\norganizationIdentifier=VATES-E67686287\nO=AJN HOSTELERIA E.S.P.J.',
      ),
    ).toEqual(['76048463K', 'E67686287'])
  })

  it('reads a natural person alone', () => {
    expect(subjectNifs('C=ES\nserialNumber=IDCES-08885194H\nCN=X')).toEqual([
      '08885194H',
    ])
  })
})
