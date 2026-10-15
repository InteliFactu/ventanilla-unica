import { expect, it } from 'vitest'
import { selectRayuelaChild } from './selectRayuelaChild'

it('selectRayuelaChild reads synthetic portal markup and rejects unsupported input', () => {
  const children = [
    { id: '123', name: 'Example, Dana' },
    { id: '456', name: 'Example, River' },
  ]
  expect(selectRayuelaChild(children, '123')).toEqual(children[0])
  expect(selectRayuelaChild(children, 'dAnA')).toEqual(children[0])
  expect(() => selectRayuelaChild(children, 'Example')).toThrow('ambiguous')
  expect(() => selectRayuelaChild(children, 'missing')).toThrow(
    '123: Example, Dana',
  )
  expect(() => selectRayuelaChild([], '')).toThrow('current child')
})
