import { expect, it } from 'vitest'
import { parseRayuelaMessages } from './parseRayuelaMessages'

it('parseRayuelaMessages reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    parseRayuelaMessages(
      '<font id="numero_registros">Registros: 1-200 de 388</font>',
    ),
  ).toMatchObject({
    total: 388,
    messages: [],
  })
  expect(parseRayuelaMessages('Registros: 0').notes).toContain(
    'No message was opened or marked as read.',
  )
  expect(parseRayuelaMessages('Registros: 0')).toMatchObject({
    total: 0,
    messages: [],
  })
  expect(() => parseRayuelaMessages('')).toThrow('total was not found')
})
