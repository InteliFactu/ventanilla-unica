import { readAttribute } from '../readAttribute'

/**
 * Whether the markup holds a `<tag>` element whose `id` is `id`. It tells a
 * missing control from a present but empty one, which the value readers both
 * answer with null. Strip comments first: a commented-out element counts.
 */
export const hasElementWithId = (
  html: string,
  tag: string,
  id: string,
): boolean =>
  [...html.matchAll(/<([a-z][\w-]*)\b[^>]*>/gi)].some(
    ([element, name]) =>
      name?.toLowerCase() === tag && readAttribute(element, 'id') === id,
  )
