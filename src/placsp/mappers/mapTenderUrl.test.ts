import { describe, expect, it } from 'vitest'

import { mapTenderUrl } from './mapTenderUrl'

const canonical =
  'https://contrataciondelestado.es/wps/poc?uri=deeplink:detalle_licitacion&idEvl=abcDEF0123456%2B%3D%3D'

describe('mapTenderUrl', () => {
  it('reads the idEvl of a PLACSP link on either host, or a bare one', () => {
    expect(
      mapTenderUrl(
        'https://contrataciondelestado.es/wps/poc?uri=deeplink:detalle_licitacion&idEvl=abcDEF0123456%2B%3D%3D',
      ),
    ).toBe(canonical)
    expect(
      mapTenderUrl(
        'https://www.contrataciondelsectorpublico.gob.es/wps/poc?uri=deeplink:detalle_licitacion&idEvl=abcDEF0123456%2B%3D%3D',
      ),
    ).toBe(canonical)
    expect(mapTenderUrl('abcDEF0123456%2B%3D%3D')).toBe(canonical)
    expect(mapTenderUrl('abcDEF0123456+==')).toBe(canonical)
  })

  it('refuses file numbers, other hosts and links without idEvl', () => {
    expect(() => mapTenderUrl('202600000109')).toThrow('file number')
    expect(() => mapTenderUrl('https://example.com/?idEvl=x')).toThrow(
      'not a PLACSP link',
    )
    expect(() =>
      mapTenderUrl('https://contrataciondelestado.es/wps/portal/plataforma'),
    ).toThrow('no idEvl')
    expect(() => mapTenderUrl('a b')).toThrow('neither')
  })
})
