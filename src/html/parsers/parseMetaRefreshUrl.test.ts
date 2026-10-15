import { describe, expect, it } from 'vitest'

import { parseMetaRefreshUrl } from './parseMetaRefreshUrl'

describe('parseMetaRefreshUrl', () => {
  it('resolves the refresh target against the page and decodes entities', () => {
    const html =
      '<meta http-equiv="refresh" content="0; url=/login/clave?a=1&amp;b=2">'

    expect(parseMetaRefreshUrl(html, 'https://am.example.es/x')).toBe(
      'https://am.example.es/login/clave?a=1&b=2',
    )
  })

  it('answers undefined for a page without one', () => {
    expect(parseMetaRefreshUrl('<p>hi</p>', 'https://a.es/')).toBeUndefined()
  })
})
