import { expect, it } from 'vitest'
import { readRayuelaSelectedLabel } from './readRayuelaSelectedLabel'

it('readRayuelaSelectedLabel returns the selected label or nothing', () => {
  const html =
    '<select name="A"><option value="1">One</option><option value="2" selected>Two</option></select><select name="B"><option value="3">Three</option></select>'
  expect(readRayuelaSelectedLabel(html, 'A')).toBe('Two')
  expect(readRayuelaSelectedLabel(html, 'B')).toBe('')
})
