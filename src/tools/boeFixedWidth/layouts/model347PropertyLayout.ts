import type { FixedWidthSchema } from '../types/FixedWidthSchema'
import { model347DetailPrefix } from './model347DetailPrefix'
import { spanishProvinceCodes } from './spanishProvinceCodes'

/** AEAT modelo 347, 2025 design, type 2 property record. */
export const model347PropertyLayout: FixedWidthSchema = {
  recordLength: 500,
  fields: [
    ...model347DetailPrefix('I'),
    {
      name: 'signoArrendamiento',
      start: 99,
      length: 1,
      kind: 'A',
      allowed: [' ', 'N'],
    },
    { name: 'importeArrendamiento', start: 100, length: 15, kind: 'N' },
    {
      name: 'situacion',
      start: 115,
      length: 1,
      kind: 'N',
      allowed: ['1', '2', '3', '4'],
    },
    { name: 'referenciaCatastral', start: 116, length: 25, kind: 'A' },
    { name: 'tipoVia', start: 141, length: 5, kind: 'A' },
    { name: 'nombreVia', start: 146, length: 50, kind: 'A' },
    { name: 'tipoNumeracion', start: 196, length: 3, kind: 'X' },
    { name: 'numeroCasa', start: 199, length: 5, kind: 'X' },
    { name: 'calificador', start: 204, length: 3, kind: 'X' },
    { name: 'bloque', start: 207, length: 3, kind: 'A' },
    { name: 'portal', start: 210, length: 3, kind: 'A' },
    { name: 'escalera', start: 213, length: 3, kind: 'A' },
    { name: 'planta', start: 216, length: 3, kind: 'A' },
    { name: 'puerta', start: 219, length: 3, kind: 'A' },
    { name: 'complemento', start: 222, length: 40, kind: 'X' },
    { name: 'localidad', start: 262, length: 30, kind: 'A' },
    { name: 'municipio', start: 292, length: 30, kind: 'A' },
    { name: 'codigoMunicipio', start: 322, length: 5, kind: 'A' },
    {
      name: 'provincia',
      start: 327,
      length: 2,
      kind: 'N',
      allowed: spanishProvinceCodes,
    },
    { name: 'codigoPostal', start: 329, length: 5, kind: 'A' },
  ],
}
