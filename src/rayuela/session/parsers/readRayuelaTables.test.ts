import { expect, it } from 'vitest'
import { readRayuelaTables } from './readRayuelaTables'

it('readRayuelaTables reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    readRayuelaTables(
      '<table><tr><td><TABLE class="TableData"><tr></tr></TABLE></td></tr></table>',
    ),
  ).toEqual(['<tr></tr>'])
})
