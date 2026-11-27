/** Require at least one distinct positive group identifier before requesting settings. */
export const validateAlertLevels = (levels: readonly number[]): void => {
  if (
    levels.length === 0 ||
    levels.some((level) => !Number.isSafeInteger(level) || level <= 0) ||
    new Set(levels).size !== levels.length
  )
    throw new Error('--grupos must list distinct positive group levels')
}
