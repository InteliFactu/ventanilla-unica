/** One POST a fake registry client received: where it went and its body as text. */
export type RecordedPost = {
  readonly url: string
  readonly body: string
}
