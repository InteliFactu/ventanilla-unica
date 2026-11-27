import type { FixedWidthSchema } from '../types/FixedWidthSchema'
import { model347DetailPrefix } from './model347DetailPrefix'
import { model347QuarterlyFields } from './model347QuarterlyFields'
import { spanishProvinceCodes } from './spanishProvinceCodes'

/** AEAT modelo 347, 2025 design, type 2 declared-party record. */
export const model347DeclaredLayout: FixedWidthSchema = {
  recordLength: 500,
  fields: [
    ...model347DetailPrefix('D'),
    {
      name: 'provincia',
      start: 77,
      length: 2,
      kind: 'N',
      allowed: [...spanishProvinceCodes, '99'],
    },
    { name: 'pais', start: 79, length: 2, kind: 'A' },
    {
      name: 'claveOperacion',
      start: 82,
      length: 1,
      kind: 'A',
      allowed: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    },
    {
      name: 'signoOperaciones',
      start: 83,
      length: 1,
      kind: 'A',
      allowed: [' ', 'N'],
    },
    { name: 'importeOperaciones', start: 84, length: 15, kind: 'N' },
    { name: 'seguro', start: 99, length: 1, kind: 'A', allowed: [' ', 'X'] },
    {
      name: 'arrendamiento',
      start: 100,
      length: 1,
      kind: 'A',
      allowed: [' ', 'X'],
    },
    { name: 'importeMetalico', start: 101, length: 15, kind: 'N' },
    {
      name: 'signoTransmisiones',
      start: 116,
      length: 1,
      kind: 'A',
      allowed: [' ', 'N'],
    },
    { name: 'importeTransmisiones', start: 117, length: 15, kind: 'N' },
    { name: 'ejercicioMetalico', start: 132, length: 4, kind: 'N' },
    ...model347QuarterlyFields,
    { name: 'nifComunitario', start: 264, length: 17, kind: 'A' },
    {
      name: 'criterioCaja',
      start: 281,
      length: 1,
      kind: 'A',
      allowed: [' ', 'X'],
    },
    {
      name: 'inversion',
      start: 282,
      length: 1,
      kind: 'A',
      allowed: [' ', 'X'],
    },
    { name: 'deposito', start: 283, length: 1, kind: 'A', allowed: [' ', 'X'] },
    {
      name: 'signoCriterioCaja',
      start: 284,
      length: 1,
      kind: 'A',
      allowed: [' ', 'N'],
    },
    { name: 'importeCriterioCaja', start: 285, length: 15, kind: 'N' },
    { name: 'convocatoriaBdns', start: 300, length: 6, kind: 'N' },
  ],
}
