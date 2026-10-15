import { describe, expect, it } from 'vitest'

import { parseRelecSlots } from './parseRelecSlots'

describe('parseRelecSlots', () => {
  it('reads each NEW row and ignores the per-person copies', () => {
    expect(
      parseRelecSlots({
        '61_NEWname': 'Instancia General',
        '61_NEWdescription': 'Instancia General Mod-201',
        '61_NEWtipo': '2017',
        '61_NEWrequired': 'true',
        '61_NEWDocReq': '61',
        '62_NEWname': 'Memoria',
        '62_NEWDocReq': '62',
        '61_2000DocReq': '61',
      }),
    ).toEqual([
      {
        dboid: '61',
        name: 'Instancia General',
        description: 'Instancia General Mod-201',
        required: true,
        typeDboid: '2017',
      },
      {
        dboid: '62',
        name: 'Memoria',
        description: '',
        required: false,
        typeDboid: '',
      },
    ])
  })
})
