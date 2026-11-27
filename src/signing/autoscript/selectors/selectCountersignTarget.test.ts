import { expect, it } from 'vitest'

import { parseExtraParams } from '../parsers/parseExtraParams'
import { selectCountersignTarget } from './selectCountersignTarget'

it('uses whole-tree selection only when it is explicitly requested', () => {
  expect(selectCountersignTarget(parseExtraParams(undefined))).toBe('leafs')
  expect(selectCountersignTarget(parseExtraParams('target=LEAFS'))).toBe(
    'leafs',
  )
  expect(selectCountersignTarget(parseExtraParams('target=TrEe'))).toBe('tree')
  expect(() =>
    selectCountersignTarget(parseExtraParams('target=nodes')),
  ).toThrow('must be tree or leafs')
})
