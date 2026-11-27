import type { Model303Field } from '../types/Model303Field'

/** AEAT field types. The envelope validator checks the single-byte encoding. */
export const model303FieldPatterns: Readonly<Record<Model303Field[2], RegExp>> =
  {
    A: /^(?:\p{L}[\p{L} ]*| +)$/u,
    An: /^(?:[\p{L}\d][\p{L}\d ]*| +)$/u,
    Num: /^\d+$/,
    N: /^N?\d+$/,
    blank: /^ +$/,
  }
