import { expect, it } from 'vitest'
import { parseRayuelaMessage } from './parseRayuelaMessage'

it('parseRayuelaMessage reads synthetic portal markup and rejects unsupported input', () => {
  const row = `<TD><img src="../images/icosFile/adjunto.png"></TD><TD><div class='jsonLinea' style='display:none'>{&quot;ASUNTO&quot;:&quot;News&quot;,&quot;CUERPO_MENSAJE&quot;:&quot;&lt;p&gt;Hello&lt;/p&gt;&quot;}</div></TD><TD>Taylor Example</TD><TD>News</TD><TD>Jueves</TD>`
  expect(parseRayuelaMessage(row, '123')).toEqual({
    id: '123',
    from: 'Taylor Example',
    subject: 'News',
    body: 'Hello',
    dateText: 'Jueves',
    hasAttachments: true,
  })
  expect(
    parseRayuelaMessage(
      row.replace('icosFile/adjunto.png', 'icosFile/sinAdjunto.png'),
      '123',
    ).hasAttachments,
  ).toBe(false)
  expect(() => parseRayuelaMessage('', '123')).toThrow('invalid')
})
