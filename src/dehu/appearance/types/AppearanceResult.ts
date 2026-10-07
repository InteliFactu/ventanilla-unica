import type { AppearanceOutcome } from './AppearanceOutcome'

/** The answer of `dehu comparecer`: the plan, whether it ran, and one outcome per requested identifier. */
export type AppearanceResult = {
  readonly action: string
  readonly executed: boolean
  readonly plan: readonly string[]
  readonly outcomes: readonly AppearanceOutcome[]
}
