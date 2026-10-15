import type { ExtraParams } from '../types/ExtraParams'

/**
 * Whether `expPolicy` asks for the AGE policy v1.9 (`FirmaAGE`, `FirmaAGE19`).
 * Any other named policy (`FirmaAGE18`, with other hashes) is refused rather
 * than signed under the wrong one.
 */
export const selectAgePolicyRequested = (params: ExtraParams): boolean => {
  const name = params.get('expPolicy')
  if (name === undefined || name === '') return false
  if (name === 'FirmaAGE' || name === 'FirmaAGE19') return true
  throw new Error(`unsupported expPolicy: ${name}`)
}
