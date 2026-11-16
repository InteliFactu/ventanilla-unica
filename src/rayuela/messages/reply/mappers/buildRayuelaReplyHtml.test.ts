import { expect, it } from 'vitest'
import { buildRayuelaReplyHtml } from './buildRayuelaReplyHtml'

it('wraps paragraphs, breaks lines and escapes markup', () => {
  expect(
    buildRayuelaReplyHtml(' Hola <b> & adiós.\nGracias\n\nUn saludo '),
  ).toBe('<p>Hola &lt;b&gt; &amp; adiós.<br>Gracias</p>\n<p>Un saludo</p>')
})
