import { expect, it } from 'vitest'
import { readRayuelaAttachmentFlag } from './readRayuelaAttachmentFlag'

it('reads synthetic readRayuelaAttachmentFlag markup', () => {
  expect(
    readRayuelaAttachmentFlag('<img src="../images/icosFile/adjunto.png">'),
  ).toBe(true)
  expect(
    readRayuelaAttachmentFlag('<img src="../images/icosFile/sinAdjunto.png">'),
  ).toBe(false)
  expect(readRayuelaAttachmentFlag('')).toBe(false)
})
