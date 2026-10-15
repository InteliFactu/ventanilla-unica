import { describe, expect, it } from 'vitest'

import { parseExtraParams } from '../parsers/parseExtraParams'
import { padesTimestampsOf } from './padesTimestampsOf'

const url = 'https://tsa.example.test/tsr'

describe('padesTimestampsOf', () => {
  it.each([
    [undefined, true, false],
    ['1', true, false],
    ['2', false, true],
    ['3', true, true],
  ])(
    'tsType %s stamps the signature %s and the document %s',
    (type, signature, document) => {
      const params = parseExtraParams(
        `tsaURL=${url}${type === undefined ? '' : `\ntsType=${type}`}`,
      )
      const stamps = padesTimestampsOf(params)
      expect(stamps.timestamp !== undefined).toBe(signature)
      expect(stamps.documentTimestamp !== undefined).toBe(document)
    },
  )

  it('stamps nothing without a TSA and refuses an unknown type', () => {
    expect(padesTimestampsOf(parseExtraParams('tsType=2'))).toEqual({})
    expect(() =>
      padesTimestampsOf(parseExtraParams(`tsaURL=${url}\ntsType=4`)),
    ).toThrow('tsType is 1, 2 or 3')
  })
})
