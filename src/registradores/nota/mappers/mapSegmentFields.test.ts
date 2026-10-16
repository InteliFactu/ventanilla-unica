import { describe, expect, it } from 'vitest'

import { mapSegmentFields } from './mapSegmentFields'

describe('mapSegmentFields', () => {
  it('checks the representation group with the administrators', () => {
    const fields = mapSegmentFields(['administradores', 'capital'])
    expect(fields).toMatchObject({
      administradores: 'true',
      socialRep: 'true',
      capital: 'true',
      _actos: 'on',
      _checkReference: 'on',
    })
    expect(fields['actos']).toBeUndefined()
  })

  it('leaves the group unchecked without administrators', () => {
    expect(mapSegmentFields(['libros'])['socialRep']).toBeUndefined()
  })
})
