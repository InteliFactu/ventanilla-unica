import { expect, it } from 'vitest'
import { readRayuelaRows } from './readRayuelaRows'

it('readRayuelaRows reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    readRayuelaRows(
      '<TR><TH>Header</TH></TR><TR><TD class="cuerpo1">A</TD></TR>',
    ),
  ).toEqual([['A']])
})
