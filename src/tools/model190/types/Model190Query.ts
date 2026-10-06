import type { Model190Declarant } from './Model190Declarant'

/** `aeat modelo190`: the perceptor CSV, the declarant data and the file to write. */
export type Model190Query = {
  readonly datos: string
  readonly out: string
  readonly declarant: Model190Declarant
}
