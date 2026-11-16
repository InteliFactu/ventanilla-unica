import { expect, it } from 'vitest'
import { parseRayuelaTemplate } from './parseRayuelaTemplate'

const answer = (data: unknown): Buffer =>
  Buffer.from(`\n\n${JSON.stringify(data)}`)
it('reads the UTF-8 config and status of an accepted call', () => {
  expect(
    parseRayuelaTemplate(
      answer({
        estadoCorrecto: true,
        mensajeEstado: 'Petición válida',
        config: { a: 'ñ' },
      }),
    ),
  ).toEqual({ config: { a: 'ñ' }, status: 'Petición válida' })
})
it('rejects a refused or malformed call', () => {
  expect(() =>
    parseRayuelaTemplate(
      answer({ estadoCorrecto: false, mensajeEstado: 'No', config: {} }),
    ),
  ).toThrow('refused the request: No')
  expect(() => parseRayuelaTemplate(answer({ estadoCorrecto: true }))).toThrow(
    'invalid',
  )
})

it('reads a Latin-1 answer without mangling accents', () => {
  const raw = Buffer.from(
    JSON.stringify({ estadoCorrecto: true, config: { a: 'Alcalá' } }),
    'latin1',
  )
  expect(parseRayuelaTemplate(raw).config).toEqual({ a: 'Alcalá' })
})
