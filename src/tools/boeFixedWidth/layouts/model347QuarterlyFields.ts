import type { FixedWidthField } from '../types/FixedWidthField'

/** Signed amounts for the four quarters of the 347 declared-party record. */
export const model347QuarterlyFields: readonly FixedWidthField[] = [
  {
    name: 'signoOperaciones1T',
    start: 136,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeOperaciones1T', start: 137, length: 15, kind: 'N' },
  {
    name: 'signoTransmisiones1T',
    start: 152,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeTransmisiones1T', start: 153, length: 15, kind: 'N' },
  {
    name: 'signoOperaciones2T',
    start: 168,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeOperaciones2T', start: 169, length: 15, kind: 'N' },
  {
    name: 'signoTransmisiones2T',
    start: 184,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeTransmisiones2T', start: 185, length: 15, kind: 'N' },
  {
    name: 'signoOperaciones3T',
    start: 200,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeOperaciones3T', start: 201, length: 15, kind: 'N' },
  {
    name: 'signoTransmisiones3T',
    start: 216,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeTransmisiones3T', start: 217, length: 15, kind: 'N' },
  {
    name: 'signoOperaciones4T',
    start: 232,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeOperaciones4T', start: 233, length: 15, kind: 'N' },
  {
    name: 'signoTransmisiones4T',
    start: 248,
    length: 1,
    kind: 'A',
    allowed: [' ', 'N'],
  },
  { name: 'importeTransmisiones4T', start: 249, length: 15, kind: 'N' },
]
