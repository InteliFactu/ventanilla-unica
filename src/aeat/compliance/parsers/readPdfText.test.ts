import { deflateSync } from 'node:zlib'

import { describe, expect, it } from 'vitest'

import { readPdfText } from './readPdfText'

const stream = (body: Buffer): Buffer =>
  Buffer.concat([
    Buffer.from(`<< /Length ${String(body.length)} >>\nstream\n`, 'latin1'),
    body,
    Buffer.from('\nendstream\n', 'latin1'),
  ])

describe('readPdfText', () => {
  it('joins the Tj runs of every inflatable stream and skips the rest', () => {
    const content = [
      'BT /F1 8 Tf (CERTIFICA: Que ACME SL) Tj ET',
      // "tiene carácter" in WinAnsi hex, as MotorPDF writes runs with accents.
      'BT <7469656E6520636172E163746572>  Tj ET',
      'BT (de   POSITIVO.) Tj ET',
    ].join('\n')
    const pdf = Buffer.concat([
      Buffer.from('%PDF-1.4\n', 'latin1'),
      stream(Buffer.from([0xff, 0xd8, 0xff, 0x00])),
      stream(deflateSync(Buffer.from(content, 'latin1'))),
    ])

    expect(readPdfText(pdf)).toBe(
      'CERTIFICA: Que ACME SL tiene carácter de POSITIVO.',
    )
  })

  it('stops at a stream with no endstream', () => {
    expect(readPdfText(Buffer.from('%PDF-1.4\nstream\nxx', 'latin1'))).toBe('')
  })
})
