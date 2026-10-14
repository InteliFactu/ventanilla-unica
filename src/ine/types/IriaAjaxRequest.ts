/** A PrimeFaces partial-ajax button press: its form, the button, the view state and the fields to send. */
export type IriaAjaxRequest = {
  readonly form: string
  readonly source: string
  readonly viewState: string
  readonly render?: string | undefined
  readonly fields?: Readonly<Record<string, string>> | undefined
}
