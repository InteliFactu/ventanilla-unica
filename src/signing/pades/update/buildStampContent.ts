import { stampText } from './stampText'

/** The content stream of a `width` x `height` stamp: a frame and the lines from the top, Helvetica 8. */
export const buildStampContent = (
  lines: readonly string[],
  width: number,
  height: number,
): Buffer => {
  const content = [
    `q 0.2 0.2 0.2 RG 0.5 w 0.5 0.5 ${String(width - 1)} ${String(height - 1)} re S Q`,
    `BT /Helv 8 Tf 0 g 6 ${String(height - 16)} Td`,
    ...lines.map(
      (line, index) => `${index === 0 ? '' : '0 -12 Td '}${stampText(line)} Tj`,
    ),
    'ET',
  ]
  return Buffer.from(content.join('\n'), 'latin1')
}
