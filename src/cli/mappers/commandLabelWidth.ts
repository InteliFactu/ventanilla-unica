import type { Command } from '../types/Command'

/** The help column width: the longest `portal action` label plus its indent and a two-space gap. */
export const commandLabelWidth = (commands: readonly Command[]): number =>
  Math.max(
    0,
    ...commands.map((command) => `${command.portal} ${command.action}`.length),
  ) + 4
