import { describe, expect, it } from 'vitest'

import { readViewState } from './readViewState'

describe('readViewState', () => {
  it('reads the first ViewState input, decoding entities', () => {
    expect(
      readViewState(
        '<input type="hidden" name="javax.faces.ViewState" id="javax.faces.ViewState" value="a&#43;b" />',
      ),
    ).toBe('a+b')
  })

  it('answers undefined without one', () => {
    expect(readViewState('<input name="x" value="y" />')).toBeUndefined()
    expect(readViewState('<input name="javax.faces.ViewState" />')).toBe(
      undefined,
    )
  })
})
