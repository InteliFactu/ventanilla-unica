import { describe, expect, it } from 'vitest'

import { youthGuaranteePage } from '../fixtures/youthGuaranteePage'
import { readYouthGuaranteeFields } from './readYouthGuaranteeFields'
import { readYouthGuaranteeForm } from './readYouthGuaranteeForm'

describe('wizard controls', () => {
  it('lists offered select choices and required labels without session state', () => {
    expect(readYouthGuaranteeFields(youthGuaranteePage(2))).toEqual([
      {
        name: 'choice',
        label: 'Choice (*)',
        type: 'select',
        required: true,
        readOnly: false,
        options: [
          { value: 'A', label: 'First option' },
          { value: 'B', label: 'Second option' },
        ],
      },
    ])
  })
  it('does not leak prefilled personal values or outer popup controls', () => {
    const html = youthGuaranteePage(2)
      .replace(
        '<form name="contSol">',
        '<input type="radio" name="browser" value="2"><form name="contSol">',
      )
      .replace(
        '<select id="choice"',
        '<input type="text" name="holder" value="INVENTED HOLDER" readonly><select id="choice"',
      )
    expect(JSON.stringify(readYouthGuaranteeFields(html))).not.toMatch(
      /INVENTED HOLDER|synthetic-|browser|outer|limpiar/,
    )
  })
  it('retains only hidden state and readonly identity for a submission', () => {
    expect(
      readYouthGuaranteeForm(
        youthGuaranteePage(2),
        'https://garantiajuvenil.sepe.es/solicitudPaso2',
        2,
      ),
    ).toEqual({
      action: 'https://garantiajuvenil.sepe.es/solicitudPaso2Token.action',
      fields: {
        'struts.token.name': 'token',
        token: 'synthetic-2',
        confirmaMovil: '1',
      },
    })
  })
  it('rejects missing or stale wizard pages', () => {
    expect(() =>
      readYouthGuaranteeForm(
        youthGuaranteePage(2),
        'https://garantiajuvenil.sepe.es/solicitudPaso2',
        3,
      ),
    ).toThrow(/missing inscription/)
  })
  it('groups radio choices and preserves their portal values', () => {
    const html = youthGuaranteePage(2).replace(
      '</select>',
      '</select><label for="yes">Yes</label><input type="radio" name="answer" id="yes" value="S"><label for="no">No</label><input type="radio" name="answer" id="no" value="N">',
    )
    expect(
      readYouthGuaranteeFields(html).find((field) => field.name === 'answer')
        ?.options,
    ).toEqual([
      { value: 'S', label: 'Yes' },
      { value: 'N', label: 'No' },
    ])
  })
})
