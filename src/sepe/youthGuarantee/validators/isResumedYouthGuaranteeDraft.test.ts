import { describe, expect, it } from 'vitest'

import { isResumedYouthGuaranteeDraft } from './isResumedYouthGuaranteeDraft'

describe('isResumedYouthGuaranteeDraft', () => {
  it('recognises a login that resumes the wizard on a later step', () => {
    expect(
      isResumedYouthGuaranteeDraft(
        'https://garantiajuvenil.sepe.es/solicitudPaso2.action',
      ),
    ).toBe(true)
  })
  it('ignores step 1, other pages and other hosts', () => {
    expect(
      isResumedYouthGuaranteeDraft(
        'https://garantiajuvenil.sepe.es/solicitudPaso1',
      ),
    ).toBe(false)
    expect(
      isResumedYouthGuaranteeDraft('https://garantiajuvenil.sepe.es/inicio'),
    ).toBe(false)
    expect(
      isResumedYouthGuaranteeDraft(
        'https://example.test/solicitudPaso2.action',
      ),
    ).toBe(false)
  })
})
