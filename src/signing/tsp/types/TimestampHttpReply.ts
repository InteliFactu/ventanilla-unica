/** A TSA's HTTP answer: its status and body. */
export type TimestampHttpReply = {
  readonly status: number
  readonly body: Buffer
}
