import { describe, expect, it } from 'vitest'

import { changeTaxAddress } from './changeTaxAddress'
import { m036Portal } from './fixtures/m036Portal'
import { taxAddressRequest } from './fixtures/taxAddressRequest'

const events = (portal: ReturnType<typeof m036Portal>): readonly string[] =>
  portal.mock.calls
    .filter(([url]) => url.endsWith('/zkau'))
    .map(
      ([, options]) =>
        `${options?.form?.['cmd_0'] ?? ''}:${options?.form?.['uuid_0'] ?? ''}`,
    )

describe('changeTaxAddress', () => {
  it('sends nothing in plan mode', async () => {
    const portal = m036Portal()
    const result = await changeTaxAddress(
      { request: portal, cookie: () => undefined },
      taxAddressRequest,
    )
    expect(result.executed).toBe(false)
    expect(result.notes).toEqual([])
    expect(portal).not.toHaveBeenCalled()
  })

  it('sends nothing when the options are invalid, even confirmed', async () => {
    const portal = m036Portal()
    const result = await changeTaxAddress(
      { request: portal, cookie: () => undefined },
      { ...taxAddressRequest, codigoPostal: 'x', confirm: true },
    )
    expect(result.executed).toBe(false)
    expect(result.notes).toHaveLength(1)
    expect(portal).not.toHaveBeenCalled()
  })

  it('fills, validates and files when confirmed', async () => {
    const portal = m036Portal()
    const result = await changeTaxAddress(
      { request: portal, cookie: () => undefined },
      { ...taxAddressRequest, confirm: true },
    )
    expect(result.executed).toBe(true)
    expect(result.receipt).toEqual({
      labels: ['Presentación realizada'],
      urls: ['/wlpl/BU36-M036/justificante?id=1'],
    })
    const echo = portal.mock.calls.at(-1)?.[1]?.form
    expect(echo?.['data_0']).toBe('{"":[{"kls":"k1","codErr":"0"}]}')
    expect(events(portal)).toEqual([
      'onCheck:c122',
      'onChange:lug',
      'onChange:cal',
      'onChange:fir',
      'onClick:bBus',
      'onChange:cp',
      'onClick:bcp',
      'onChange:nvf',
      'onSelect:lvb',
      'onClick:bsel',
      'onChange:tn',
      'onChange:nc',
      'onChange:co',
      'onChange:ri',
      'onChange:rc',
      'onCheck:tr',
      'onClick:bVal',
      'onClick:bFirm',
      'onCheck:chA',
      'onClick:bAE',
      'onPresenvali:',
    ])
    expect(
      portal.mock.calls.find(([url]) => url.endsWith('/zkau'))?.[1]?.form?.[
        'dtid'
      ],
    ).toBe('z_ab-cd')
  })

  it('skips the complemento when none is given', async () => {
    const portal = m036Portal()
    await changeTaxAddress(
      { request: portal, cookie: () => undefined },
      { ...taxAddressRequest, complemento: undefined, confirm: true },
    )
    expect(events(portal)).not.toContain('onChange:co')
  })

  it('stops before filing on a validation error or a signature error', async () => {
    const invalid = m036Portal({ bVal: "value:'12345',value:'Mal'" })
    await expect(
      changeTaxAddress(
        { request: invalid, cookie: () => undefined },
        { ...taxAddressRequest, confirm: true },
      ),
    ).rejects.toThrow('did not validate (12345 Mal)')
    expect(events(invalid)).not.toContain('onClick:bFirm')
    const refused = m036Portal({ bFirm: "value:'99999',value:'No'" })
    await expect(
      changeTaxAddress(
        { request: refused, cookie: () => undefined },
        { ...taxAddressRequest, confirm: true },
      ),
    ).rejects.toThrow('refused the signature')
  })

  it('refuses an ambiguous street and a form for another NIF', async () => {
    const ambiguous = m036Portal({ nvf: "Listitem','l1' Listitem','l2'" })
    await expect(
      changeTaxAddress(
        { request: ambiguous, cookie: () => undefined },
        { ...taxAddressRequest, confirm: true },
      ),
    ).rejects.toThrow('matched 2 streets')
    await expect(
      changeTaxAddress(
        { request: m036Portal(), cookie: () => undefined },
        { ...taxAddressRequest, nif: 'B11111111', confirm: true },
      ),
    ).rejects.toThrow('did not open for --nif B11111111')
  })
})
