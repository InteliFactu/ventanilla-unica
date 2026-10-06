import type { Model190Declarant } from '../types/Model190Declarant'
import type { Model190Perceptor } from '../types/Model190Perceptor'
import { buildDeclarantRecord } from './buildDeclarantRecord'
import { buildPerceptorRecord } from './buildPerceptorRecord'

/** The whole file: the type 1 record, then one type 2 record per perceptor row, with no line breaks. */
export const buildModel190File = (
  declarant: Model190Declarant,
  perceptors: readonly Model190Perceptor[],
): string =>
  [
    buildDeclarantRecord(declarant, perceptors),
    ...perceptors.map((perceptor) =>
      buildPerceptorRecord(declarant, perceptor),
    ),
  ].join('')
