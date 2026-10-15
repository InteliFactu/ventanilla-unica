import { describe, expect, it } from 'vitest'

import { parseVisorSession } from './parseVisorSession'

const url = 'https://eje.justicia.es/visor-webapp/x?execution=e1s1'

describe('parseVisorSession', () => {
  it('reads the token, execution, expediente and procedimiento', () => {
    const html = `<meta name="_csrf" content="abc" />
<div id="petAjax" execution='e1s1' style="visibility: hidden"></div>
<script>var codExpediente = '100P2026'; var procedimiento = "MON 0000001/2026";</script>`

    expect(parseVisorSession(html, url)).toEqual({
      url,
      csrf: 'abc',
      execution: 'e1s1',
      codExpediente: '100P2026',
      procedimiento: 'MON 0000001/2026',
    })
  })

  it('names the access refusal instead of a parse failure', () => {
    expect(() =>
      parseVisorSession('<h3>No tiene acceso al procedimiento</h3>', url),
    ).toThrow(/refuses this expediente/)
  })
})
