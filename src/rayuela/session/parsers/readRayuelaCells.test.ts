import { expect, it } from 'vitest'
import { readRayuelaCells } from './readRayuelaCells'

it('readRayuelaCells reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    readRayuelaCells('<TD><font>A&amp;B</font><br>C</TD><td></td>'),
  ).toEqual(['A&B C', ''])
})
