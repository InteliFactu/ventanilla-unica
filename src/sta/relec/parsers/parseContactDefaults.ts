import type { RelecContact } from '../types/RelecContact'

/**
 * The contact ways the form prefills for the represented entity:
 * `$("contact21").value="..."` is the e-mail and `$("contact1").value="..."`
 * the phone ("Teléfono particular"). Either may be missing.
 */
export const parseContactDefaults = (html: string): RelecContact => {
  const ways = new Map(
    [...html.matchAll(/\$\("contact(\d+)"\)\.value="([^"]*)"/g)].map(
      ([, id = '', value = '']) => [id, value.trim()],
    ),
  )
  return {
    email: ways.get('21') || undefined,
    phone: ways.get('1') || undefined,
  }
}
