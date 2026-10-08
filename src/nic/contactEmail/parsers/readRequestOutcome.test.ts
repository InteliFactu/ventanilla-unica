import { describe, expect, it } from 'vitest'

import { readRequestOutcome } from './readRequestOutcome'

describe('readRequestOutcome', () => {
  it('returns the success sentence', () => {
    expect(
      readRequestOutcome(
        '<p>La petición de cambio de email ha sido realizada con éxito.</p>',
      ),
    ).toBe('La petición de cambio de email ha sido realizada con éxito.')
  })

  it('throws with the error box text', () => {
    expect(() =>
      readRequestOutcome(
        '<div class="errorMessage"><li>El identificador no existe</li></div>',
      ),
    ).toThrow('El identificador no existe')
  })

  it('throws with the page text when there is no error box', () => {
    expect(() => readRequestOutcome('<p>Algo inesperado</p>')).toThrow(
      'Algo inesperado',
    )
  })
})
