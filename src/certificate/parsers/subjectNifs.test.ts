import { describe, expect, it } from 'vitest'

import { subjectNifs } from './subjectNifs'

describe('subjectNifs', () => {
  it('reads the holder and the represented entity', () => {
    expect(
      subjectNifs(
        'serialNumber=IDCES-00000003A\nGN=CHRISTIAN\norganizationIdentifier=VATES-E00000059\nO=AJN HOSTELERIA E.S.P.J.',
      ),
    ).toEqual(['00000003A', 'E00000059'])
  })

  it('reads a natural person alone', () => {
    expect(subjectNifs('C=ES\nserialNumber=IDCES-00000001R\nCN=X')).toEqual([
      '00000001R',
    ])
  })
})
