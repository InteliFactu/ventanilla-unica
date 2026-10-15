/** The `<h4 class="title4">` sections of an STA page, each with its `dt`/`dd` entries by label. */
export type StaSections = Readonly<
  Record<string, Readonly<Record<string, string>>>
>
