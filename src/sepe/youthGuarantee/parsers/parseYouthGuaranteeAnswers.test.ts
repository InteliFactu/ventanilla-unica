import { describe, expect, it } from 'vitest'

import { parseYouthGuaranteeAnswers } from './parseYouthGuaranteeAnswers'

describe('declared answer JSON', () => {
  it('allows an empty local plan', () => {
    expect(parseYouthGuaranteeAnswers()).toEqual({})
  })
  it.each([
    '[]',
    'null',
    '"string"',
    '{"7":{}}',
    '{"1":[]}',
    '{"2":{"choice":true}}',
  ])('rejects %s', (value) => {
    expect(() => parseYouthGuaranteeAnswers(value)).toThrow(/--respuestas/)
  })
  it('preserves explicit false declarations and portal codes as strings', () => {
    expect(
      parseYouthGuaranteeAnswers('{"6":{"checkConsentimiento":"false"}}'),
    ).toEqual({ '6': { checkConsentimiento: 'false' } })
  })
})
