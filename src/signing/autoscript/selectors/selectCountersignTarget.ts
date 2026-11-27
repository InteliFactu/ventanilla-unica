import type { CountersignTarget } from '../../types/CountersignTarget'
import type { ExtraParams } from '../types/ExtraParams'

/** AutoFirma applies either a whole-tree countersignature or the default leaf selection. */
export const selectCountersignTarget = (
  params: ExtraParams,
): CountersignTarget => {
  const target = params.get('target')?.toLowerCase() ?? 'leafs'
  if (target === 'tree' || target === 'leafs') return target
  throw new Error('AutoScript countersign target must be tree or leafs')
}
