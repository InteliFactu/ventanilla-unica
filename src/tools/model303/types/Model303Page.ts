import type { Model303PageLayout } from './Model303PageLayout'

/** One complete fixed-width page and the layout it was parsed with. */
export type Model303Page = {
  readonly layout: Model303PageLayout
  readonly text: string
}
