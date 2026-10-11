import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { readDgtJson } from './readDgtJson'

describe('readDgtJson', () => {
  it('parses a JSON object', () => {
    expect(
      readDgtJson(htmlResponse('https://x.gob.es/a', '{"ok":1}'), 's'),
    ).toEqual({ ok: 1 })
  })

  it('reports the gateway fault or the body that was not an object', () => {
    const fault = {
      ...htmlResponse(
        'https://x.gob.es/a',
        '<env:Fault><faultstring>Rejected by policy. (from client)</faultstring></env:Fault>',
      ),
      status: 500,
    }
    expect(() => readDgtJson(fault, 'holder data')).toThrow(
      'DGT holder data: 500 Rejected by policy. (from client)',
    )
    expect(() =>
      readDgtJson(htmlResponse('https://x.gob.es/a', '[1]'), 's'),
    ).toThrow('DGT s: 200 [1]')
  })
})
