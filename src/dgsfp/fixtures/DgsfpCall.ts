/** One request a fake DGSFP client received, its body as text. */
export type DgsfpCall = {
  readonly url: string
  readonly body: string
}
