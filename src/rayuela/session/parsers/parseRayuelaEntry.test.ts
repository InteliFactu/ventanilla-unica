import { expect, it } from 'vitest'
import { parseRayuelaEntry } from './parseRayuelaEntry'

it('parseRayuelaEntry reads synthetic portal markup and rejects unsupported input', () => {
  expect(
    parseRayuelaEntry(
      '\n\n' +
        JSON.stringify({
          nombreVentana: 'w1',
          menu: 'Menu.jsp',
          barraNavegacion: 'Barra.jsp',
        }),
    ),
  ).toEqual({
    window: 'w1',
    menu: 'https://rayuela.educarex.es/segedu/jsp/Menu.jsp',
    navigation: 'https://rayuela.educarex.es/segedu/jsp/Barra.jsp',
  })
  expect(() => parseRayuelaEntry('{}')).toThrow('invalid session')
  expect(() => parseRayuelaEntry('null')).toThrow()
  expect(() =>
    parseRayuelaEntry(
      JSON.stringify({
        nombreVentana: 'w',
        menu: 'https://evil.example',
        barraNavegacion: 'b',
      }),
    ),
  ).toThrow('unexpected URL')
})
