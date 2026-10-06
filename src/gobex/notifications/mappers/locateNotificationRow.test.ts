import { describe, expect, it } from 'vitest'

import { locateNotificationRow } from './locateNotificationRow'

const form = { action: 'https://sede.gobex.es/a.jsf', fields: { f: 'f' } }

describe('locateNotificationRow', () => {
  it('keeps the form fields without a fragment ViewState, and swaps it in with one', () => {
    expect(
      locateNotificationRow(
        [{ record: { notification: 'N' }, link: 'l' }],
        'N',
        form,
        undefined,
      ),
    ).toEqual({ record: { notification: 'N' }, link: 'l', form })
    expect(
      locateNotificationRow(
        [{ record: { notification: 'N' }, link: 'l' }],
        'N',
        form,
        's2',
      )?.form.fields,
    ).toEqual({ f: 'f', 'javax.faces.ViewState': 's2' })
  })

  it('answers undefined when the page does not hold the row', () => {
    expect(locateNotificationRow([], 'N', form, undefined)).toBeUndefined()
  })
})
