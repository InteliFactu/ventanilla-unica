import { encodeLatin1Form } from './encodeLatin1Form'
import type { FormPair } from './types/FormPair'

/**
 * An ISO-8859-1 `application/x-www-form-urlencoded` body from ordered pairs,
 * as `encodeLatin1Form` builds it, but keeping the order and any repeated
 * name: a browser submits every control, and some forms carry two with the
 * same name.
 */
export const encodeLatin1Pairs = (pairs: readonly FormPair[]): string =>
  pairs.map(([name, value]) => encodeLatin1Form({ [name]: value })).join('&')
