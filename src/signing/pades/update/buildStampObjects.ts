import { indirectObject } from '../objects/indirectObject'
import { pdfArray } from '../objects/pdfArray'
import { pdfDict } from '../objects/pdfDict'
import { pdfRaw } from '../objects/pdfRaw'
import { pdfRefTo } from '../objects/pdfRefTo'
import { streamObject } from '../objects/streamObject'
import type { ObjectAllocator } from '../types/ObjectAllocator'
import type { StampObjects } from '../types/StampObjects'
import { allocateObject } from './allocateObject'
import { buildStampContent } from './buildStampContent'

/** A Helvetica font and the stamp's form XObject, sized to `rect` ([llx lly urx ury]). */
export const buildStampObjects = (
  allocator: ObjectAllocator,
  lines: readonly string[],
  rect: readonly number[],
): StampObjects => {
  const [llx = 0, lly = 0, urx = 0, ury = 0] = rect
  const width = urx - llx
  const height = ury - lly
  const font = allocateObject(allocator)
  const appearance = allocateObject(allocator)
  const fontDict = pdfDict([
    ['Type', pdfRaw('/Font')],
    ['Subtype', pdfRaw('/Type1')],
    ['BaseFont', pdfRaw('/Helvetica')],
    ['Encoding', pdfRaw('/WinAnsiEncoding')],
  ])
  const formDict = pdfDict([
    ['Type', pdfRaw('/XObject')],
    ['Subtype', pdfRaw('/Form')],
    [
      'BBox',
      pdfArray([0, 0, width, height].map((value) => pdfRaw(String(value)))),
    ],
    ['Resources', pdfDict([['Font', pdfDict([['Helv', pdfRefTo(font)]])]])],
  ])
  return {
    rect,
    appearance: pdfRefTo(appearance),
    objects: [
      indirectObject(font, 0, fontDict),
      streamObject(
        appearance,
        formDict,
        buildStampContent(lines, width, height),
      ),
    ],
  }
}
