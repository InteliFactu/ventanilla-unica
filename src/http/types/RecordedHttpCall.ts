import type { HttpRequestOptions } from './HttpRequestOptions'

/** One request a fake HTTP client recorded: its URL and options. */
export type RecordedHttpCall = {
  url: string
  options: HttpRequestOptions
}
