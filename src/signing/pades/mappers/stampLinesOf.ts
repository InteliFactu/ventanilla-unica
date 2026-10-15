import { formatSignDate } from '../formatters/formatSignDate'
import type { SignatureDetails } from '../types/SignatureDetails'
import { defaultStampLines } from './defaultStampLines'

/**
 * The stamp's lines: the default ones, or AutoFirma's `layer2Text` template
 * split on newlines, with `$$SUBJECTCN$$`, `$$REASON$$`, `$$LOCATION$$`,
 * `$$CONTACT$$` and `$$SIGNDATE=<pattern>$$` filled in.
 */
export const stampLinesOf = (
  details: SignatureDetails,
  template: string | undefined,
): string[] => {
  if (template === undefined) return defaultStampLines(details)
  const values: Readonly<Record<string, string>> = {
    SUBJECTCN: details.commonName,
    REASON: details.reason ?? '',
    LOCATION: details.location ?? '',
    CONTACT: details.contactInfo ?? '',
  }
  return template
    .replace(/\$\$SIGNDATE=([^$]*)\$\$/g, (_match, pattern: string) =>
      formatSignDate(details.date, pattern),
    )
    .replace(
      /\$\$([A-Z]+)\$\$/g,
      (match, name: string) => values[name] ?? match,
    )
    .split(/\r?\n/)
}
