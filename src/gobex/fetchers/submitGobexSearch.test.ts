import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { submitGobexSearch } from './submitGobexSearch'

const url = 'https://sede.gobex.es/SEDE/privado/ciudadanos/Notificaciones.jsf'

const answer = (text: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.from(text),
  text,
})

describe('submitGobexSearch', () => {
  it('reads the form id from the page and hands it back with the results', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValueOnce(
        answer(
          '<form id="j_id9" action="Notificaciones.jsf"><input type="hidden" name="j_id9" value="j_id9"/><input type="image" src="/i/bt_buscar.gif" name="j_id9:b"/></form>',
        ),
      )
      .mockResolvedValueOnce(answer('results'))
    const search = await submitGobexSearch(
      { request, cookie: () => undefined },
      url,
      (form) => ({ [`${form}:estado`]: '' }),
    )
    expect(search.formId).toBe('j_id9')
    expect(search.results.text).toBe('results')
    expect(request.mock.calls[1]?.[1]?.form).toMatchObject({
      'j_id9:estado': '',
    })
  })
})
