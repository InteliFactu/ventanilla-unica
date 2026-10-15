import { describe, expect, it } from 'vitest'

import { parseRelecVariables } from './parseRelecVariables'

describe('parseRelecVariables', () => {
  it('names each DinVar field by its DinTit label', () => {
    expect(
      parseRelecVariables({
        DinTitANNOT_TEXT_EXTRACT: 'Asunto:',
        solicituddesc: 'Instancia general',
      }),
    ).toEqual([{ name: 'ANNOT_TEXT_EXTRACT', label: 'Asunto' }])
  })
})
