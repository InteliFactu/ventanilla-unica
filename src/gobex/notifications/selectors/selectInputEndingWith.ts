import { readAttribute } from '../../../html/readAttribute'

/** The name of the first input whose name ends with `:suffix` (a JSF id under a form whose id changes between releases). */
export const selectInputEndingWith = (
  html: string,
  suffix: string,
): string | undefined =>
  [...html.matchAll(/<input\b[^>]*>/gi)]
    .map(([tag]) => readAttribute(tag, 'name') ?? '')
    .find((name) => name.endsWith(`:${suffix}`))
