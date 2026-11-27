import type { RelecVariable } from '../types/RelecVariable'

/** Find labelled text fields accepted by the catalogue filing's variable overrides. */
export const selectEditableRelecVariables = (
  variables: readonly RelecVariable[],
  writable: ReadonlySet<string>,
): readonly RelecVariable[] =>
  variables.filter(
    ({ name }) => name !== 'ANNOT_TEXT_EXTRACT' && writable.has(name),
  )
