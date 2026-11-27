import type { BoeFileValidation } from '../../boeFixedWidth/types/BoeFileValidation'

/** Local layout validation of a 2025 or 2026 tagged modelo 303 file. */
export type Model303FileValidation = BoeFileValidation & {
  readonly modelo: '303'
  readonly periodo: string
  readonly validation: 'layout'
}
