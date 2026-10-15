import { expect, it } from 'vitest'
import { readRayuelaFields } from './readRayuelaFields'

it('readRayuelaFields reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    readRayuelaFields(
      'Grupo:&nbsp;<font class="columnaValor">A</font> Tutor/a:&nbsp;<font class="columnaValor">Example</font>',
    ).get('Grupo'),
  ).toBe('A')
})
