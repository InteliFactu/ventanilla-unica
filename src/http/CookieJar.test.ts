import { describe, expect, it } from 'vitest'

import { CookieJar } from './CookieJar'

const tgss = 'sp.seg-social.es'

describe('CookieJar', () => {
  it('keeps host-only cookies on their host and domain cookies on the subtree', () => {
    const jar = new CookieJar()
    jar.store('pasarela.clave.gob.es', ['JSESSIONID=abc; Path=/; HttpOnly'])
    jar.store('pasarela-ident.clave.gob.es', [
      'relay=1; Domain=.clave.gob.es; Secure',
    ])
    jar.store('dehu.redsara.es', ['other=2'])
    expect(jar.headerFor('pasarela.clave.gob.es')).toBe(
      'JSESSIONID=abc; relay=1',
    )
    expect(jar.headerFor('pasarela-ident.clave.gob.es')).toBe('relay=1')
    expect(jar.headerFor('dehu.redsara.es')).toBe('other=2')
    expect(jar.headerFor('www1.agenciatributaria.gob.es')).toBeUndefined()
  })

  it('drops cookies scoped to a public suffix or to another domain', () => {
    const jar = new CookieJar()
    jar.store('sede.oargt.es', [
      'wide=1; Domain=.es',
      'gov=2; Domain=gob.es',
      'foreign=3; Domain=bde.es',
      'own=4; Domain=oargt.es',
    ])
    expect(jar.headerFor('aps.bde.es')).toBeUndefined()
    expect(jar.headerFor('pasarela.clave.gob.es')).toBeUndefined()
    expect(jar.headerFor('sede.oargt.es')).toBe('own=4')
  })

  it('overwrites a cookie set again and ignores malformed headers', () => {
    const jar = new CookieJar()
    jar.store(tgss, ['JSESSIONID=one', 'nonsense', '=empty'])
    jar.store(tgss, ['JSESSIONID=two; Path=/; domain='])
    expect(jar.get(tgss, 'JSESSIONID')).toBe('two')
    expect(jar.get(tgss, 'nonsense')).toBeUndefined()
    expect(jar.headerFor(tgss)).toBe('JSESSIONID=two')
  })

  it('deletes a cookie whose header expires it, as WebSphere Portal does', () => {
    const jar = new CookieJar()
    jar.store(tgss, ['keep=1', 'gone=2', 'aged=3'])
    jar.store(tgss, [
      'gone=; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/',
      'aged=x; Max-Age=0',
      'keep=4; Expires=Fri, 01-Jan-2100 00:00:00 GMT',
    ])
    expect(jar.headerFor(tgss)).toBe('keep=4')
  })
})
