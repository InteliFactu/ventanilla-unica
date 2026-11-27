import { expect, it } from 'vitest'
import { readRayuelaOptions } from './readRayuelaOptions'

it('readRayuelaOptions reads only the named select', () => {
  const html =
    '<select name="A"><option value="1">One</option></select><select class="combo" name="B"><option value="2" selected="selected">Two&nbsp;2</option><option value="3">Three</option></select>'
  expect(readRayuelaOptions(html, 'B')).toEqual([
    { value: '2', label: 'Two 2', selected: true },
    { value: '3', label: 'Three', selected: false },
  ])
  expect(readRayuelaOptions(html, 'C')).toEqual([])
})
