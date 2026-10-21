import { describe, expect, it } from 'vitest'

import { mergeCarpetaFragment } from './mergeCarpetaFragment'

describe('mergeCarpetaFragment', () => {
  it('updates duplicate ViewState inputs in every form, not just the first form', () => {
    const input =
      '<input id="javax.faces.ViewState" name="javax.faces.ViewState" value="old">'
    const updated =
      '<input id="javax.faces.ViewState" name="javax.faces.ViewState" value="new">'
    expect(
      mergeCarpetaFragment(
        `<form>${input}</form><form>${input}</form>`,
        updated,
      ),
    ).toBe(`<form>${updated}</form><form>${updated}</form>`)
  })
})
