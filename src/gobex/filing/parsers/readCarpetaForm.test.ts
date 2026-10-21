import { describe, expect, it } from 'vitest'

import { readCarpetaForm } from './readCarpetaForm'

describe('readCarpetaForm', () => {
  it('does not press unrelated actions or grant unchecked consents', () => {
    const form = readCarpetaForm(
      '<form id="f" action="/SEDE/x"><input name="f" value="f"><input name="consent" type="checkbox"><input name="delete" type="image"><input name="notifications" type="checkbox" checked="checked"><select name="province"><option value="">Choose</option><option value="10" selected="selected">Caceres</option></select><input name="javax.faces.ViewState" value="new-state"></form>',
      'https://sede.gobex.es/SEDE/x',
      'f',
    )
    expect(form.fields).toEqual({
      f: 'f',
      notifications: 'on',
      province: '10',
      'javax.faces.ViewState': 'new-state',
    })
  })
  it('rejects unexpected pages instead of falling back to another form', () => {
    expect(() =>
      readCarpetaForm(
        '<form id="delete"></form>',
        'https://sede.gobex.es/SEDE/x',
        'f',
      ),
    ).toThrow('missing form')
  })
})
