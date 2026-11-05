/**
 * Quote a text as one POSIX shell argument: wrap it in single quotes and close,
 * escape and reopen around each single quote it contains, so spaces, accents,
 * `$` and quotes reach the command unchanged.
 */
export const mapShellArgument = (text: string): string =>
  `'${text.replaceAll("'", String.raw`'\''`)}'`
