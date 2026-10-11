/** One ZK client event for the simulator: command, target widget, `data_0` payload. */
export type DraftEvent = {
  readonly cmd: 'onUpload' | 'onClick'
  readonly uuid: string
  readonly data: Readonly<Record<string, unknown>>
}
