import type { Model190Perceptor } from '../types/Model190Perceptor'
import { parsePerceptorRow } from './parsePerceptorRow'
import { readCsvRows } from './readCsvRows'

/** The CSV text -> perceptors; an error names the data row (1 = first after the header) it came from. */
export const parsePerceptorRows = (text: string): Model190Perceptor[] =>
  readCsvRows(text).map((row, index) => {
    try {
      return parsePerceptorRow(row)
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      throw new Error(`row ${String(index + 1)}: ${reason}`, {
        cause: error,
      })
    }
  })
