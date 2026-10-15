import { expect, it } from 'vitest'
import { parseRayuelaMessagePreview } from './parseRayuelaMessagePreview'

it('reads synthetic parseRayuelaMessagePreview markup', () => {
  expect(
    parseRayuelaMessagePreview(
      `<div class='jsonLinea' style='display:none'>{&quot;ASUNTO&quot;:&quot;News&quot;,&quot;CUERPO_MENSAJE&quot;:&quot;&lt;p&gt;Preview&lt;/p&gt;&quot;}</div>`,
    ),
  ).toEqual({ subject: 'News', body: 'Preview' })
  expect(() => parseRayuelaMessagePreview('')).toThrow('invalid')
})
