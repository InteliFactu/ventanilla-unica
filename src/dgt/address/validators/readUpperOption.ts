import type { CliOptions } from '../../../cli/types/CliOptions'

/** One command-line option trimmed and upper-cased, or '' when absent. */
export const readUpperOption = (options: CliOptions, name: string): string =>
  options[name]?.trim().toUpperCase() ?? ''
