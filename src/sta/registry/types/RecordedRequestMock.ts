/** The `mock` side of a `vi.fn` standing in for `HttpClient.request`. */
export type RecordedRequestMock = {
  readonly mock: {
    readonly calls: [string, { method?: string; body?: string | Buffer }?][]
  }
}
