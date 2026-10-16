import { describe, expect, it } from 'vitest'

import { readCheckoutUrl } from './readCheckoutUrl'

describe('readCheckoutUrl', () => {
  it('reads the https action of redsys_form', () => {
    expect(
      readCheckoutUrl(
        '<form action="https://pay.example.com/f?a=1&amp;b=2" method="post" id="redsys_form">',
      ),
    ).toBe('https://pay.example.com/f?a=1&b=2')
  })

  it('refuses a missing form, plain http and markup in the URL', () => {
    expect(
      readCheckoutUrl('<form id="other" action="https://x.example">'),
    ).toBeUndefined()
    expect(
      readCheckoutUrl(
        '<form action="http://pay.example.com" id="redsys_form">',
      ),
    ).toBeUndefined()
    expect(
      readCheckoutUrl(
        `<form action='https://x.example/"><script>' id="redsys_form">`,
      ),
    ).toBeUndefined()
  })
})
