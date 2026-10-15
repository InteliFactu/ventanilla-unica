import type { ExtraParams } from '../types/ExtraParams'

/**
 * Read AutoScript `extraParams`, a Java properties text: one `key=value` (or
 * `key:value`) per line, `#` and `!` comments, keys and values trimmed.
 * shortcut: no `\` escapes or continuation lines, which no sede page seen
 * uses; add them when one does.
 */
export const parseExtraParams = (text: string | undefined): ExtraParams => {
  const params = new Map<string, string>()
  for (const raw of (text ?? '').split(/\r?\n/)) {
    const line = raw.trim()
    if (line === '' || line.startsWith('#') || line.startsWith('!')) continue
    const at = line.search(/[=:]/)
    if (at <= 0) continue
    params.set(line.slice(0, at).trim(), line.slice(at + 1).trim())
  }
  return params
}
