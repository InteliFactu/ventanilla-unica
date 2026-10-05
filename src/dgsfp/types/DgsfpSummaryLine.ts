/** One line of the request document before layout. */
export type DgsfpSummaryLine = {
  readonly text: string
  readonly style: 'title' | 'section' | 'label' | 'value'
}
